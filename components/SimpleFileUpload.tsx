// components/SimpleFileUpload.tsx
'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { useCloudinaryImage } from '@/hooks/useCloudinary';
import { X, Upload, Loader2 } from 'lucide-react';

interface SimpleFileUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    onUploadSuccess?: (response: any) => void;
    onUploadError?: (error: string) => void;
    onDeleteSuccess?: () => void;
    onDeleteError?: (error: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    previewType?: 'avatar' | 'logo' | 'image';
    previewName?: string;
    accept?: string;
    maxSize?: string;
    helpText?: string;
    allowDelete?: boolean;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
    value = '',
    onChange,
    onUploadSuccess,
    onUploadError,
    onDeleteSuccess,
    onDeleteError,
    placeholder = "Choose file",
    disabled = false,
    className,
    previewType = 'image',
    previewName = '',
    accept = "image/*",
    maxSize = "10MB",
    helpText,
    allowDelete = true
}) => {
    const {
        imageUrl,
        uploadImage,
        deleteImage,
        isUploading,
        isDeleting,
        uploadError,
        deleteError,
        resetUploadState,
        resetDeleteState
    } = useCloudinaryImage(value, {
        onUploadSuccess: (response) => {
            onChange?.(response.secure_url);
            onUploadSuccess?.(response);
        },
        onUploadError: (error) => {
            onUploadError?.(error.message);
        },
        onDeleteSuccess: () => {
            onChange?.('');
            onDeleteSuccess?.();
        },
        onDeleteError: (error) => {
            onDeleteError?.(error.message);
        }
    });

    const getPreviewContainer = () => {
        const baseClasses = "border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm";
        
        switch (previewType) {
            case 'avatar':
                return `h-12 w-12 rounded-full ${baseClasses}`;
            case 'logo':
                return `h-12 w-12 rounded-lg ${baseClasses}`;
            case 'image':
            default:
                return `h-12 w-16 rounded-lg ${baseClasses}`;
        }
    };

    const getPreviewImage = () => {
        const imageClasses = previewType === 'avatar' ? "h-full w-full object-cover" : "h-full w-full object-contain";
        
        return (
            <img 
                src={imageUrl} 
                alt={`${previewType} preview`}
                className={imageClasses}
                onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                }}
            />
        );
    };

    const getFallbackInitials = () => {
        if (previewName) {
            if (previewType === 'avatar') {
                return previewName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            } else {
                return previewName.substring(0, 2).toUpperCase();
            }
        }
        
        switch (previewType) {
            case 'avatar':
                return 'AU';
            case 'logo':
                return 'LG';
            case 'image':
            default:
                return 'IMG';
        }
    };

    const getHelpText = () => {
        if (helpText) return helpText;
        
        switch (previewType) {
            case 'avatar':
                return `Upload profile picture - JPG, PNG, or GIF (max ${maxSize})`;
            case 'logo':
                return `Upload company logo - JPG, PNG, or SVG (max ${maxSize})`;
            case 'image':
            default:
                return `Upload image - JPG, PNG, or GIF (max ${maxSize})`;
        }
    };

    const getPreviewLabel = () => {
        switch (previewType) {
            case 'avatar':
                return 'Profile picture preview';
            case 'logo':
                return 'Logo preview';
            case 'image':
            default:
                return 'Image preview';
        }
    };

    const handleFileSelect = async (file: File) => {
        // Reset previous errors
        resetUploadState();
        resetDeleteState();
        
        // Upload to Cloudinary
        await uploadImage(file);
    };

    const handleDelete = async () => {
        if (!imageUrl) return;
        
        // Reset previous errors
        resetUploadState();
        resetDeleteState();
        
        // Delete from Cloudinary
        await deleteImage();
    };

    const renderPreviewContent = () => {
        // Show loading state while uploading
        if (isUploading) {
            return (
                <div className="flex flex-col items-center justify-center text-blue-500">
                    <Loader2 className="h-4 w-4 animate-spin mb-1" />
                    <span className="text-xs">Uploading...</span>
                </div>
            );
        }

        // Show deleting state
        if (isDeleting) {
            return (
                <div className="flex flex-col items-center justify-center text-red-500">
                    <Loader2 className="h-4 w-4 animate-spin mb-1" />
                    <span className="text-xs">Deleting...</span>
                </div>
            );
        }

        // Show uploaded image
        if (imageUrl && !isUploading) {
            return (
                <>
                    {getPreviewImage()}
                    <div className="hidden text-xs font-medium text-gray-400 text-center">
                        {getFallbackInitials()}
                    </div>
                </>
            );
        }

        // Show fallback when no image
        return (
            <div className="text-xs font-medium text-gray-400 text-center flex flex-col items-center">
                <Upload className="h-4 w-4 mb-1" />
                {getFallbackInitials()}
            </div>
        );
    };

    const getStatusMessage = () => {
        if (isUploading) {
            return "Uploading image to cloud storage...";
        }
        
        if (isDeleting) {
            return "Removing image from cloud storage...";
        }

        if (uploadError) {
            return uploadError;
        }

        if (deleteError) {
            return deleteError;
        }

        if (imageUrl && !isUploading) {
            return "✓ Image uploaded successfully";
        }

        return null;
    };

    const statusMessage = getStatusMessage();
    const hasError = uploadError || deleteError;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Preview */}
            <div className="flex items-center space-x-3">
                {/* Preview Container with Wrapper for Delete Button */}
                <div className="relative">
                    <div className={getPreviewContainer()}>
                        {renderPreviewContent()}
                    </div>
                    
                    {/* Delete button positioned outside container */}
                    {imageUrl && !isUploading && !isDeleting && allowDelete && !disabled && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-white z-50"
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        {previewName || `${previewType.charAt(0).toUpperCase() + previewType.slice(1)} Name`}
                    </p>
                    <p className="text-xs text-gray-500">
                        {getPreviewLabel()}
                    </p>
                </div>
            </div>

            {/* File Input */}
            <div className="space-y-2">
                <input
                    type="file"
                    accept={accept}
                    disabled={disabled || isUploading || isDeleting}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleFileSelect(file);
                        }
                        // Reset input value to allow selecting the same file again
                        e.target.value = '';
                    }}
                    className={cn(
                        "block w-full text-sm text-gray-500",
                        "file:mr-4 file:py-2 file:px-4 file:rounded-lg border rounded-md",
                        "file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700",
                        "hover:file:bg-blue-100 file:cursor-pointer cursor-pointer",
                        (disabled || isUploading || isDeleting) && "opacity-50 cursor-not-allowed file:cursor-not-allowed"
                    )}
                />
                
                {/* Help text */}
                <p className="text-xs text-gray-500">
                    {getHelpText()}
                </p>

                {/* Status message */}
                {statusMessage && (
                    <p className={cn(
                        "text-xs",
                        hasError ? "text-red-600" : isUploading || isDeleting ? "text-blue-600" : "text-green-600"
                    )}>
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SimpleFileUpload;