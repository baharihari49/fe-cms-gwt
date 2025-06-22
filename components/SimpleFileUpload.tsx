// components/SimpleFileUpload.tsx
'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleFileUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    previewType?: 'avatar' | 'logo' | 'image';
    previewName?: string;
    accept?: string;
    maxSize?: string;
    helpText?: string;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
    value = '',
    onChange,
    placeholder = "Choose file",
    disabled = false,
    className,
    previewType = 'image',
    previewName = '',
    accept = "image/*",
    maxSize = "10MB",
    helpText
}) => {
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
                src={value} 
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

    return (
        <div className={cn("space-y-3", className)}>
            {/* Preview */}
            <div className="flex items-center space-x-3">
                <div className={getPreviewContainer()}>
                    {value ? (
                        <>
                            {getPreviewImage()}
                            <div className="hidden text-xs font-medium text-gray-400 text-center">
                                {getFallbackInitials()}
                            </div>
                        </>
                    ) : (
                        <div className="text-xs font-medium text-gray-400 text-center">
                            {getFallbackInitials()}
                        </div>
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
                    disabled={disabled}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            // Create a preview URL for immediate display
                            const previewUrl = URL.createObjectURL(file);
                            onChange?.(previewUrl);
                            
                            // Here you would typically upload to your server
                            // For now, we'll just use the preview URL
                            console.log('File selected:', file);
                        }
                    }}
                    className={cn(
                        "block w-full text-sm text-gray-500",
                        "file:mr-4 file:py-2 file:px-4 file:rounded-lg border rounded-md",
                        "file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700",
                        "hover:file:bg-blue-100 file:cursor-pointer cursor-pointer",
                        disabled && "opacity-50 cursor-not-allowed file:cursor-not-allowed"
                    )}
                />
                <p className="text-xs text-gray-500">
                    {getHelpText()}
                </p>
            </div>
        </div>
    );
};

export default SimpleFileUpload;