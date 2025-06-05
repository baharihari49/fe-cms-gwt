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
import { Upload, Plus, X } from "lucide-react"

interface MediaTabProps {
  currentImages: any[]
  onImagesChange: (images: any[]) => void
}

export function MediaTab({ currentImages, onImagesChange }: MediaTabProps) {
  const [imageInput, setImageInput] = useState({ 
    url: "", 
    caption: "", 
    type: "SCREENSHOT" as const 
  })

  const addImage = () => {
    if (imageInput.url.trim()) {
      const newImage = {
        url: imageInput.url,
        caption: imageInput.caption || undefined,
        type: imageInput.type,
        order: currentImages.length
      }
      onImagesChange([...currentImages, newImage])
      setImageInput({ url: "", caption: "", type: "SCREENSHOT" })
    }
  }

  const removeImage = (index: number) => {
    const filtered = currentImages.filter((_, i) => i !== index)
    onImagesChange(filtered)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Project Images
          <Badge variant="secondary">{currentImages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Image Form */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Image URL (https://...)"
                value={imageInput.url}
                onChange={(e) => setImageInput(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <Select 
              value={imageInput.type} 
              onValueChange={(value) => setImageInput(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCREENSHOT">Screenshot</SelectItem>
                <SelectItem value="MOCKUP">Mockup</SelectItem>
                <SelectItem value="LOGO">Logo</SelectItem>
                <SelectItem value="DIAGRAM">Diagram</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Caption (optional)"
              value={imageInput.caption}
              onChange={(e) => setImageInput(prev => ({ ...prev, caption: e.target.value }))}
            />
            <Button type="button" onClick={addImage} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Images List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {currentImages.map((image, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {image.type}
                  </Badge>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {image.url}
                  </span>
                </div>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mt-1">{image.caption}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {currentImages.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              No images added yet. Add some project screenshots or mockups.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}