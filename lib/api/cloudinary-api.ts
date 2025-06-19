// lib/cloudinary-api.ts

import { 
  FileValidationOptions,
  ValidationResult,
  validateFile as _validateFileUtil,
  validateImageUrl as _validateImageUrlUtil
} from '../utils/validation-utils';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  backendApiUrl?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  [key: string]: any;
}

export interface CloudinaryDeleteResponse {
  success: boolean;
  message: string;
  result?: any;
}

export class CloudinaryError extends Error {
  public originalError?: any;
  public code?: string;
  public statusCode?: number;

  constructor(message: string, originalError?: any, code?: string, statusCode?: number) {
    super(message);
    this.name = 'CloudinaryError';
    this.originalError = originalError;
    this.code = code;
    this.statusCode = statusCode;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudinaryError);
    }
  }
}

// Re-export validation types for convenience
export type { FileValidationOptions, ValidationResult };

// Default configuration
const DEFAULT_CONFIG: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "du0tz73ma",
  uploadPreset: "nextjs-unsigned-upload",
  backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001"
};

export const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    if (!url.hostname.includes('cloudinary.com')) {
      return null;
    }

    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1 || uploadIndex >= pathParts.length - 1) {
      return null;
    }

    // Cari index yang merupakan nomor versi (dimulai dengan 'v' diikuti angka)
    const versionIndex = pathParts.findIndex(part => /^v\d+$/.test(part));

    let startIndex = uploadIndex + 1;
    if (versionIndex !== -1 && versionIndex === uploadIndex + 1) {
      startIndex = versionIndex + 1; // Lewati nomor versi
    }

    let publicIdParts: string[] = [];
    
    for (const part of pathParts.slice(startIndex)) {
      if (part.includes('_') && /^[a-z]_/.test(part)) {
        continue;
      }
      publicIdParts.push(part);
    }
    
    const publicIdWithExt = publicIdParts.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Hapus ekstensi

    return publicId || null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

/**
 * Upload image to Cloudinary
 */
export const uploadImageToCloudinary = async (
  file: File,
  config: Partial<CloudinaryConfig> = {},
  validationOptions: FileValidationOptions = {}
): Promise<CloudinaryUploadResponse> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Validate file first
  const validation = await _validateFileUtil(file, validationOptions);
  if (!validation.isValid) {
    throw new CloudinaryError(
      validation.error || 'File validation failed',
      null,
      'VALIDATION_ERROR',
      400
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', finalConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${finalConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Upload failed with status ${response.status}`;
      
      throw new CloudinaryError(
        errorMessage,
        errorData,
        'UPLOAD_ERROR',
        response.status
      );
    }

    const data = await response.json();
    console.log('🎉 Upload Success:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Upload Error:', error);
    
    if (error instanceof CloudinaryError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new CloudinaryError(
      error.message || 'Network error occurred during upload',
      error,
      'NETWORK_ERROR',
      0
    );
  }
};

/**
 * Delete image from Cloudinary via backend API
 */
export const deleteImageFromCloudinary = async (
  imageUrl: string,
  publicId?: string | null,
  config: Partial<CloudinaryConfig> = {}
): Promise<CloudinaryDeleteResponse> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  if (!finalConfig.backendApiUrl) {
    throw new CloudinaryError(
      'Backend API URL is required for delete operations',
      null,
      'CONFIG_ERROR',
      400
    );
  }

  const extractedPublicId = publicId || extractPublicIdFromUrl(imageUrl);

  if (!extractedPublicId) {
    throw new CloudinaryError(
      'Could not extract public_id from image URL',
      null,
      'INVALID_URL',
      400
    );
  }

  try {
    const response = await fetch(`${finalConfig.backendApiUrl}/api/cloudinary/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageUrl, 
        publicId: extractedPublicId 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Delete failed with status ${response.status}`;
      
      throw new CloudinaryError(
        errorMessage,
        errorData,
        'DELETE_ERROR',
        response.status
      );
    }

    const data = await response.json();
    console.log('🗑️ Delete Success:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Delete Error:', error);
    
    if (error instanceof CloudinaryError) {
      throw error;
    }
    
    throw new CloudinaryError(
      error.message || 'Network error occurred during delete',
      error,
      'NETWORK_ERROR',
      0
    );
  }
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  } = {}
): string => {
  try {
    const url = new URL(originalUrl);
    if (!url.hostname.includes('cloudinary.com')) {
      return originalUrl;
    }

    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return originalUrl;
    }

    // Build transformation string
    const transformationParts: string[] = [];
    
    if (transformations.width) {
      transformationParts.push(`w_${transformations.width}`);
    }
    
    if (transformations.height) {
      transformationParts.push(`h_${transformations.height}`);
    }
    
    if (transformations.quality) {
      transformationParts.push(`q_${transformations.quality}`);
    }
    
    if (transformations.format) {
      transformationParts.push(`f_${transformations.format}`);
    }
    
    if (transformations.crop) {
      transformationParts.push(`c_${transformations.crop}`);
    }

    if (transformationParts.length === 0) {
      return originalUrl;
    }

    // Insert transformations after /upload/
    const newPathParts = [
      ...pathParts.slice(0, uploadIndex + 1),
      transformationParts.join(','),
      ...pathParts.slice(uploadIndex + 1)
    ];

    url.pathname = newPathParts.join('/');
    return url.toString();
  } catch (error) {
    console.error('Error creating optimized URL:', error);
    return originalUrl;
  }
};

/**
 * CloudinaryAPI class for easier usage
 */
export class CloudinaryAPI {
  private config: CloudinaryConfig;
  private validationOptions: FileValidationOptions;

  constructor(
    config: Partial<CloudinaryConfig> = {},
    validationOptions: FileValidationOptions = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.validationOptions = {
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      ...validationOptions
    };
  }

  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    return uploadImageToCloudinary(file, this.config, this.validationOptions);
  }

  async deleteImage(imageUrl: string, publicId?: string | null): Promise<CloudinaryDeleteResponse> {
    return deleteImageFromCloudinary(imageUrl, publicId, this.config);
  }

  async validateImageUrl(url: string): Promise<boolean> {
    const result = await _validateImageUrlUtil(url);
    return result;
  }

  async validateFile(file: File): Promise<{ isValid: boolean; error?: string }> {
    return _validateFileUtil(file, this.validationOptions);
  }

  getOptimizedUrl(
    originalUrl: string,
    transformations: Parameters<typeof getOptimizedImageUrl>[1] = {}
  ): string {
    return getOptimizedImageUrl(originalUrl, transformations);
  }

  extractPublicId(imageUrl: string): string | null {
    return extractPublicIdFromUrl(imageUrl);
  }

  updateConfig(newConfig: Partial<CloudinaryConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  updateValidationOptions(newOptions: Partial<FileValidationOptions>): void {
    this.validationOptions = { ...this.validationOptions, ...newOptions };
  }

  getConfig(): CloudinaryConfig {
    return { ...this.config };
  }

  getValidationOptions(): FileValidationOptions {
    return { ...this.validationOptions };
  }
}

// Export default instance
export const cloudinaryAPI = new CloudinaryAPI();

// Export individual functions for functional approach
export {
  uploadImageToCloudinary as uploadImage,
  deleteImageFromCloudinary as deleteImage,
  getOptimizedImageUrl as getOptimizedUrl,
};

// Re-export validateFile and validateImageUrl directly from their source module
// to avoid redeclaration issues and ensure correct typing.
export { _validateFileUtil as validateFile, _validateImageUrlUtil as validateImageUrl };


