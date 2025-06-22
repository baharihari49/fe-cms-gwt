// components/CloudinaryAvatarUpload.tsx
'use client'

import { Upload, X, Image as ImageIcon, Link, Check, AlertCircle, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCloudinaryImage } from '@/hooks/useCloudinary';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CompactImagePreviewProps {
    url: string;
    onRemove?: (imageUrl: string, publicId: string | null) => void;
    isDeleting?: boolean;
    extractPublicId: (url: string) => string | null;
}

const CompactImagePreview: React.FC<CompactImagePreviewProps> = ({ 
    url, 
    onRemove, 
    isDeleting, 
    extractPublicId 
}) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    React.useEffect(() => {
        if (url) {
            setImageStatus('loading');
        }
    }, [url]);

    const handleImageLoad = () => {
        setImageStatus('loaded');
    };

    const handleImageError = () => {
        console.error('Avatar image failed to load:', url);
        setImageStatus('error');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            // Simple feedback without DOM manipulation
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const handleConfirmDelete = () => {
        if (onRemove) {
            const publicId = extractPublicId(url);
            onRemove(url, publicId);
            setShowDeleteDialog(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    Avatar Image
                </h4>
                {onRemove && (
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                disabled={isDeleting}
                                className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300",
                                    isDeleting && "opacity-50 cursor-not-allowed"
                                )}
                                title={isDeleting ? "Deleting..." : "Delete avatar"}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-500 border-t-transparent"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-3 w-3" />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        </AlertDialogTrigger>
                        
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    Delete Avatar?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the avatar image. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Compact Image Preview */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-gray-200">
                        {imageStatus === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                        )}

                        {imageStatus === 'error' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                        )}

                        <img
                            src={url}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            crossOrigin="anonymous"
                            loading="lazy"
                        />
                    </div>

                    {imageStatus === 'loaded' && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700">Image URL:</p>
                        <button
                            type="button"
                            onClick={copyToClipboard}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors px-1 py-0.5 rounded hover:bg-blue-50"
                            title="Copy URL"
                        >
                            Copy
                        </button>
                    </div>
                    <div className="bg-white rounded border p-2 max-h-12 overflow-y-auto">
                        <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">
                            {url}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CloudinaryAvatarUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    config?: {
        cloudName?: string;
        uploadPreset?: string;
        backendApiUrl?: string;
    };
}

const CloudinaryAvatarUpload: React.FC<CloudinaryAvatarUploadProps> = ({
    value = '',
    onChange,
    placeholder = "Upload avatar image",
    disabled = false,
    className,
    config
}) => {
    const [manualUrl, setManualUrl] = useState('');
    const [mode, setMode] = useState<'upload' | 'manual'>('upload');

    // Use the custom hook
    const {
        imageUrl,
        setImageUrl,
        uploadImage,
        deleteImage,
        isUploading,
        isDeleting,
        uploadError,
        deleteError,
        resetUploadState,
        resetDeleteState,
        extractPublicId
    } = useCloudinaryImage(value, {
        config,
        onUploadSuccess: (response) => {
            onChange?.(response.secure_url);
            setMode('upload');
            resetUploadState();
        },
        onDeleteSuccess: () => {
            onChange?.('');
            setManualUrl('');
            resetDeleteState();
        },
        onUploadError: (error) => {
            console.error('Avatar upload failed:', error);
        },
        onDeleteError: (error) => {
            console.error('Avatar delete failed:', error);
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleManualSubmit = () => {
        if (manualUrl.trim()) {
            setImageUrl(manualUrl.trim());
            onChange?.(manualUrl.trim());
            setMode('manual');
        }
    };

    const handleManualUrlChange = (url: string) => {
        setManualUrl(url);
        if (!url.trim()) {
            setImageUrl('');
            onChange?.('');
        }
    };

    const handleDeleteImage = async (imageUrl: string, publicId: string | null) => {
        await deleteImage(publicId);
    };

    const displayUrl = imageUrl || value;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Compact Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={cn(
                        "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'upload'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={cn(
                        "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'manual'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    <Link className="w-4 h-4 inline mr-2" />
                    URL
                </button>
            </div>

            {/* Compact Upload Mode */}
            {mode === 'upload' && (
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-lg transition-all duration-200",
                        disabled || isUploading
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer bg-white",
                        "group"
                    )}
                >
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 z-50 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        disabled={disabled || isUploading}
                    />
                    <label htmlFor="avatar-upload" className="block px-6 py-8 cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3"></div>
                                    <p className="text-sm font-medium text-gray-700">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        {placeholder}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </>
                            )}
                        </div>
                    </label>
                </div>
            )}

            {/* Manual URL Mode */}
            {mode === 'manual' && (
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={manualUrl}
                        onChange={(e) => handleManualUrlChange(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        disabled={disabled}
                        className={cn(
                            "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm",
                            "placeholder:text-gray-400",
                            disabled && "bg-gray-50 cursor-not-allowed"
                        )}
                    />
                    <button
                        type="button"
                        onClick={handleManualSubmit}
                        disabled={!manualUrl.trim() || disabled}
                        className={cn(
                            "px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",
                            "flex items-center gap-1 text-sm"
                        )}
                    >
                        <Check className="w-4 h-4" />
                        Apply
                    </button>
                </div>
            )}

            {/* Error Messages */}
            {(uploadError || deleteError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-700">
                            {uploadError || deleteError}
                        </p>
                    </div>
                </div>
            )}

            {/* Compact Image Preview */}
            {displayUrl && (
                <CompactImagePreview
                    url={displayUrl}
                    onRemove={handleDeleteImage}
                    isDeleting={isDeleting}
                    extractPublicId={extractPublicId}
                />
            )}
        </div>
    );
};

export default CloudinaryAvatarUpload;