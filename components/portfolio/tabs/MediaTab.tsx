// components/projects/tabs/MediaTab.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Plus, X, Loader2, Trash2 } from "lucide-react"
import { useCloudinary } from "@/hooks/useCloudinary"
import { CloudinaryErrorBoundary, ErrorNotification } from "@/utils/error-handler-clodinary"

interface MediaTabProps {
  currentImages: any[]
  onImagesChange: (images: any[]) => void
}

interface ImageItem {
  url: string
  caption?: string
  type: "SCREENSHOT" | "MOCKUP" | "LOGO" | "DIAGRAM" | "OTHER"
  order: number
}

export function MediaTab({ currentImages, onImagesChange }: MediaTabProps) {
  const [imageInput, setImageInput] = useState({ 
    url: "", 
    caption: "", 
    type: "SCREENSHOT" as const 
  })
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  // Cloudinary hook with proper configuration
  const {
    uploadImage,
    isUploading,
    uploadError,
    uploadProgress,
    resetUploadState,
    deleteImage,
    isDeleting,
    deleteError,
    resetDeleteState,
    validateFile,
    extractPublicId
  } = useCloudinary({
    onUploadSuccess: (response) => {
      // Auto-add uploaded image to list
      const newImage: ImageItem = {
        url: response.secure_url,
        caption: imageInput.caption || undefined,
        type: imageInput.type,
        order: currentImages.length
      }
      onImagesChange([...currentImages, newImage])
      
      // Reset form
      setImageInput({ url: "", caption: "", type: "SCREENSHOT" })
    },
    onUploadError: (error) => {
      console.error('Upload failed:', error)
    },
    onDeleteSuccess: (response) => {
      console.log('Delete successful:', response)
    },
    onDeleteError: (error) => {
      console.error('Delete failed:', error)
    },
    onValidationError: (error) => {
      console.error('Validation failed:', error)
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file first
    const validation = await validateFile(file)
    if (!validation.isValid) {
      return
    }

    try {
      await uploadImage(file)
    } catch (error) {
      console.error('Upload error in component:', error)
    }
    
    // Reset input
    event.target.value = ''
  }

  const addImageFromUrl = () => {
    if (imageInput.url.trim()) {
      const newImage: ImageItem = {
        url: imageInput.url,
        caption: imageInput.caption || undefined,
        type: imageInput.type,
        order: currentImages.length
      }
      onImagesChange([...currentImages, newImage])
      setImageInput({ url: "", caption: "", type: "SCREENSHOT" })
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = currentImages[index];
    
    if (!imageToRemove) return;

    // Check if it's a Cloudinary URL
    const isCloudinaryImage = imageToRemove.url.includes('cloudinary.com');
    
    const confirmMessage = isCloudinaryImage 
      ? 'This will delete the image from Cloudinary permanently. Are you sure?' 
      : 'Are you sure you want to remove this image?';
    
    if (!window.confirm(confirmMessage)) return;

    setDeletingIndex(index);

    try {
      // If it's a Cloudinary URL, try to delete from Cloudinary
      if (isCloudinaryImage) {
        const publicId = extractPublicId(imageToRemove.url);
        
        if (!publicId) {
          throw new Error('Could not extract public_id from URL');
        }

        // Use the deleteImage function from hook
        await deleteImage(imageToRemove.url, publicId);
      }

    } catch (error: any) {
      console.error('Delete failed:', error);
      
      // Ask user if they want to remove from list anyway
      const removeAnyway = window.confirm(
        `Failed to delete from Cloudinary: ${error.message}\n\nDo you want to remove it from the list anyway?`
      );
      
      if (!removeAnyway) {
        setDeletingIndex(null);
        return;
      }
    }

    // Remove from list regardless of Cloudinary deletion result
    const filtered = currentImages.filter((_, i) => i !== index);
    // Reorder remaining images
    const reordered = filtered.map((img, i) => ({ ...img, order: i }));
    onImagesChange(reordered);
    
    setDeletingIndex(null);
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      SCREENSHOT: "Screenshot",
      MOCKUP: "Mockup", 
      LOGO: "Logo",
      DIAGRAM: "Diagram",
      OTHER: "Other"
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <CloudinaryErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Project Images
            <Badge variant="secondary">{currentImages.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Uploading...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-1">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Error Notifications */}
          {uploadError && (
            <ErrorNotification 
              error={uploadError}
              onDismiss={resetUploadState}
              showRetry={true}
              onRetry={() => {
                resetUploadState();
              }}
            />
          )}

          {deleteError && (
            <ErrorNotification 
              error={deleteError}
              onDismiss={resetDeleteState}
            />
          )}

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload Image</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                {isUploading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Or Enter URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={imageInput.url}
                  onChange={(e) => setImageInput(prev => ({ ...prev, url: e.target.value }))}
                  disabled={isUploading}
                />
                <Button 
                  type="button" 
                  onClick={addImageFromUrl} 
                  disabled={!imageInput.url.trim() || isUploading}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Image Type</label>
              <Select 
                value={imageInput.type} 
                onValueChange={(value) => setImageInput(prev => ({ ...prev, type: value as any }))}
                disabled={isUploading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCREENSHOT">📱 Screenshot</SelectItem>
                  <SelectItem value="MOCKUP">🎨 Mockup</SelectItem>
                  <SelectItem value="LOGO">🏷️ Logo</SelectItem>
                  <SelectItem value="DIAGRAM">📊 Diagram</SelectItem>
                  <SelectItem value="OTHER">📎 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Caption (Optional)</label>
              <Input
                placeholder="Describe this image..."
                value={imageInput.caption}
                onChange={(e) => setImageInput(prev => ({ ...prev, caption: e.target.value }))}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Images List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Images ({currentImages.length})
            </h3>
            
            {currentImages.map((image, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                {/* Preview */}
                <img
                  src={image.url}
                  alt={image.caption || `${image.type} image`}
                  className="w-12 h-12 object-cover rounded border flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUMzMC41MjI4IDM1IDM1IDMwLjUyMjggMzUgMjVDMzUgMTkuNDc3MiAzMC41MjI4IDE1IDI1IDE1QzE5LjQ3NzIgMTUgMTUgMTkuNDc3MiAxNSAyNUMxNSAzMC41MjI4IDE5LjQ3NzIgMzUgMjUgMzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(image.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    {image.url.includes('cloudinary.com') && (
                      <Badge variant="secondary" className="text-xs">
                        ☁️ Cloudinary
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm font-medium truncate" title={image.url}>
                    {image.url}
                  </div>
                  
                  {image.caption && (
                    <p className="text-xs text-gray-600 mt-1">{image.caption}</p>
                  )}

                  {/* Show Public ID for Cloudinary images */}
                  {image.url.includes('cloudinary.com') && (
                    <p className="text-xs text-gray-500 mt-1">
                      Public ID: {extractPublicId(image.url) || 'Could not extract'}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  disabled={deletingIndex === index || isDeleting}
                  className="flex-shrink-0"
                >
                  {deletingIndex === index ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : image.url.includes('cloudinary.com') ? (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
            
            {currentImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No images added yet</p>
                <p className="text-xs text-gray-400">Upload files or enter URLs to add images</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </CloudinaryErrorBoundary>
  )
}