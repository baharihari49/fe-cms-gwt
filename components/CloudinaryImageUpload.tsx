// components/CloudinaryImageUpload.tsx
'use client'

import { Upload, X, Image as ImageIcon, Link, Check, AlertCircle, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCloudinaryImage } from '@/hooks/useCloudinary';

interface ImagePreviewProps {
    url: string;
    onRemove?: (imageUrl: string, publicId: string | null) => void;
    isDeleting?: boolean;
}


interface ImagePreviewProps {
    url: string;
    onRemove?: (imageUrl: string, publicId: string | null) => void;
    isDeleting?: boolean;
    extractPublicId: (url: string) => string | null; // <--- ADD THIS LINE
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url, onRemove, isDeleting, extractPublicId }) => { // <--- ADD extractPublicId HERE
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [retryCount, setRetryCount] = useState(0);

    React.useEffect(() => {
        if (url) {
            setImageStatus('loading');
            setRetryCount(0);
        }
    }, [url]);

    const handleImageLoad = () => {
        setImageStatus('loaded');
    };

    const handleImageError = () => {
        console.error('Image failed to load:', url);
        setImageStatus('error');
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setImageStatus('loading');
        const img = new Image();
        img.onload = () => setImageStatus('loaded');
        img.onerror = () => setImageStatus('error');
        img.src = `${url}?t=${Date.now()}`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            }
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            // Extract public_id using the passed utility function
            const publicId = extractPublicId(url); // <--- CHANGE THIS LINE
            onRemove(url, publicId);
        }
    };

    const cleanUrl = url.split('?')[0];

    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    Image Preview
                </h4>
                {onRemove && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isDeleting}
                        className={cn(
                            "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors",
                            isDeleting && "opacity-50 cursor-not-allowed"
                        )}
                        title={isDeleting ? "Deleting..." : "Remove image"}
                    >
                        {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden">
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                            <p className="text-sm text-gray-500">Loading image...</p>
                        </div>
                    </div>
                )}

                {imageStatus === 'error' && (
                    <div className="absolute inset-0 z-10 bg-gray-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Failed to load image</p>
                                <p className="text-xs text-gray-500 mb-3">
                                    Check if the URL is accessible and try again
                                </p>
                                <button
                                    type="button"
                                    onClick={handleRetry}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <img
                    key={`${url}-${retryCount}`}
                    src={url}
                    alt="Preview"
                    className="w-full h-48 object-cover transition-opacity duration-200"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    crossOrigin="anonymous"
                    loading="lazy"
                />

                {imageStatus === 'loaded' && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Loaded
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Link className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-gray-700">Image URL:</p>
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
                                title="Copy URL"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-md p-3 border max-h-20 overflow-y-auto">
                            <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">
                                {url}
                            </p>
                        </div>
                        {cleanUrl !== url && (
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="font-medium">Clean URL:</span> {cleanUrl}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
                <div className="mt-2 space-y-1 bg-gray-100 p-2 rounded font-mono">
                    <div>Status: {imageStatus}</div>
                    <div>Retry Count: {retryCount}</div>
                    <div>URL Length: {url.length} chars</div>
                </div>
            </details>
        </div>
    );
};
interface CloudinaryImageUploadProps {
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


const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
    value = '',
    onChange,
    placeholder = "Upload project main image",
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
        extractPublicId // <--- ADD THIS LINE
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
            console.error('Upload failed:', error);
        },
        onDeleteError: (error) => {
            console.error('Delete failed:', error);
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleRemove = () => {
        setImageUrl('');
        onChange?.('');
        setManualUrl('');
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
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        await deleteImage(publicId);
    };

    const displayUrl = imageUrl || value;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'upload'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'manual'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    <Link className="w-4 h-4 inline mr-2" />
                    Enter URL
                </button>
            </div>

            {/* Upload Mode */}
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
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 z-50 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        disabled={disabled || isUploading}
                    />
                    <label htmlFor="file-upload" className="block px-6 py-12 cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-4"></div>
                                    <p className="text-sm font-medium text-gray-700">Uploading...</p>
                                    <p className="text-xs text-gray-500 mt-1">Please wait</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                        <Upload className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <p className="text-base font-medium text-gray-900 mb-2">
                                        {placeholder}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Drag and drop or click to browse
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB • Recommended: 1200×800px
                                    </p>
                                </>
                            )}
                        </div>
                    </label>
                    {uploadError && (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 text-center rounded-b-lg">
                            Error: {uploadError}
                        </div>
                    )}
                </div>
            )}

            {/* Manual URL Mode */}
            {mode === 'manual' && (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="url"
                                value={manualUrl}
                                onChange={(e) => handleManualUrlChange(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                disabled={disabled}
                                className={cn(
                                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                                    "placeholder:text-gray-400",
                                    disabled && "bg-gray-50 cursor-not-allowed"
                                )}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleManualSubmit}
                            disabled={!manualUrl.trim() || disabled}
                            className={cn(
                                "px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",
                                "flex items-center gap-2"
                            )}
                        >
                            <Check className="w-4 h-4" />
                            Apply
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Enter a direct URL to an image file
                    </p>
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

            {/* Image Preview */}
            {displayUrl && (
                <ImagePreview
                    url={displayUrl}
                    onRemove={handleDeleteImage}
                    isDeleting={isDeleting}
                    extractPublicId={extractPublicId} // <--- PASS THIS PROP
                />
            )}
        </div>
    );
};

export default CloudinaryImageUpload;