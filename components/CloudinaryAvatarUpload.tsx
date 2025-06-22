// components/CloudinaryAvatarUpload.tsx
'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import SimpleFileUpload from '@/components/SimpleFileUpload';

interface CloudinaryAvatarUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    previewType?: 'avatar' | 'logo' | 'image';
    previewName?: string;
    config?: {
        cloudName?: string;
        uploadPreset?: string;
        backendApiUrl?: string;
    };
}

const CloudinaryAvatarUpload: React.FC<CloudinaryAvatarUploadProps> = ({
    value = '',
    onChange,
    placeholder = "Upload image",
    disabled = false,
    className,
    previewType = 'avatar',
    previewName = '',
    config
}) => {
    // For now, we'll use the simple file upload
    // You can integrate with Cloudinary here by:
    // 1. Using the file from SimpleFileUpload's onChange
    // 2. Uploading to Cloudinary
    // 3. Calling onChange with the Cloudinary URL

    const handleFileChange = (url: string) => {
        // Here you would upload to Cloudinary and get the URL
        // For now, we'll just pass through the blob URL
        onChange?.(url);
    };

    return (
        <div className={cn("", className)}>
            <SimpleFileUpload
                value={value}
                onChange={handleFileChange}
                placeholder={placeholder}
                disabled={disabled}
                previewType={previewType}
                previewName={previewName}
                accept="image/*"
                maxSize="10MB"
            />
        </div>
    );
};

export default CloudinaryAvatarUpload;