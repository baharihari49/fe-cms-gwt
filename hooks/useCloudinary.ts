// hooks/useCloudinary.ts

import { useState, useCallback } from 'react';
import { 
  CloudinaryAPI, 
  CloudinaryConfig, 
  CloudinaryUploadResponse, 
  CloudinaryDeleteResponse,
  CloudinaryError,
  FileValidationOptions
} from '@/lib/api/cloudinary-api';

export interface UseCloudinaryUploadState {
  isUploading: boolean;
  uploadError: string | null;
  uploadProgress: number;
}

export interface UseCloudinaryDeleteState {
  isDeleting: boolean;
  deleteError: string | null;
}

export interface UseCloudinaryOptions {
  config?: Partial<CloudinaryConfig>;
  validationOptions?: FileValidationOptions;
  onUploadSuccess?: (response: CloudinaryUploadResponse) => void;
  onUploadError?: (error: CloudinaryError) => void;
  onDeleteSuccess?: (response: CloudinaryDeleteResponse) => void;
  onDeleteError?: (error: CloudinaryError) => void;
  onValidationError?: (error: string) => void;
}

/**
 * Format error message for user display
 */
const formatErrorMessage = (error: unknown): string => {
  if (error instanceof CloudinaryError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Hook for handling Cloudinary uploads
 */
export const useCloudinaryUpload = (options: UseCloudinaryOptions = {}) => {
  const [uploadState, setUploadState] = useState<UseCloudinaryUploadState>({
    isUploading: false,
    uploadError: null,
    uploadProgress: 0,
  });

  const cloudinaryAPI = new CloudinaryAPI(options.config, options.validationOptions);

  const uploadImage = useCallback(async (file: File): Promise<CloudinaryUploadResponse | null> => {
    setUploadState({
      isUploading: true,
      uploadError: null,
      uploadProgress: 0,
    });

    try {
      // Pre-validate file if needed
      const validation = await cloudinaryAPI.validateFile(file);
      if (!validation.isValid) {
        const errorMessage = validation.error || 'File validation failed';
        
        setUploadState({
          isUploading: false,
          uploadError: errorMessage,
          uploadProgress: 0,
        });

        options.onValidationError?.(errorMessage);
        return null;
      }

      const response = await cloudinaryAPI.uploadImage(file);
      
      setUploadState({
        isUploading: false,
        uploadError: null,
        uploadProgress: 100,
      });

      options.onUploadSuccess?.(response);
      return response;
    } catch (error: any) {
      const errorMessage = formatErrorMessage(error);
      
      setUploadState({
        isUploading: false,
        uploadError: errorMessage,
        uploadProgress: 0,
      });

      // Pass the full error object to callback
      if (error instanceof CloudinaryError) {
        options.onUploadError?.(error);
      } else {
        const cloudinaryError = new CloudinaryError(errorMessage, error);
        options.onUploadError?.(cloudinaryError);
      }
      
      return null;
    }
  }, [options.onUploadSuccess, options.onUploadError, options.onValidationError]);

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      uploadError: null,
      uploadProgress: 0,
    });
  }, []);

  return {
    uploadImage,
    resetUploadState,
    ...uploadState,
  };
};

/**
 * Hook for handling Cloudinary deletions
 */
export const useCloudinaryDelete = (options: UseCloudinaryOptions = {}) => {
  const [deleteState, setDeleteState] = useState<UseCloudinaryDeleteState>({
    isDeleting: false,
    deleteError: null,
  });

  const cloudinaryAPI = new CloudinaryAPI(options.config, options.validationOptions);

  const deleteImage = useCallback(async (
    imageUrl: string, 
    publicId?: string | null
  ): Promise<CloudinaryDeleteResponse | null> => {
    setDeleteState({
      isDeleting: true,
      deleteError: null,
    });

    try {
      const response = await cloudinaryAPI.deleteImage(imageUrl, publicId);
      
      setDeleteState({
        isDeleting: false,
        deleteError: null,
      });

      options.onDeleteSuccess?.(response);
      return response;
    } catch (error: any) {
      const errorMessage = formatErrorMessage(error);
      
      setDeleteState({
        isDeleting: false,
        deleteError: errorMessage,
      });

      // Pass the full error object to callback
      if (error instanceof CloudinaryError) {
        options.onDeleteError?.(error);
      } else {
        const cloudinaryError = new CloudinaryError(errorMessage, error);
        options.onDeleteError?.(cloudinaryError);
      }
      
      return null;
    }
  }, [options.onDeleteSuccess, options.onDeleteError]);

  const resetDeleteState = useCallback(() => {
    setDeleteState({
      isDeleting: false,
      deleteError: null,
    });
  }, []);

  return {
    deleteImage,
    resetDeleteState,
    ...deleteState,
  };
};

/**
 * Combined hook for both upload and delete operations
 */
export const useCloudinary = (options: UseCloudinaryOptions = {}) => {
  const uploadHook = useCloudinaryUpload(options);
  const deleteHook = useCloudinaryDelete(options);

  const cloudinaryAPI = new CloudinaryAPI(options.config, options.validationOptions);

  return {
    // Upload methods
    uploadImage: uploadHook.uploadImage,
    isUploading: uploadHook.isUploading,
    uploadError: uploadHook.uploadError,
    uploadProgress: uploadHook.uploadProgress,
    resetUploadState: uploadHook.resetUploadState,

    // Delete methods
    deleteImage: deleteHook.deleteImage,
    isDeleting: deleteHook.isDeleting,
    deleteError: deleteHook.deleteError,
    resetDeleteState: deleteHook.resetDeleteState,

    // Utility methods
    validateImageUrl: cloudinaryAPI.validateImageUrl.bind(cloudinaryAPI),
    validateFile: cloudinaryAPI.validateFile.bind(cloudinaryAPI),
    getOptimizedUrl: cloudinaryAPI.getOptimizedUrl.bind(cloudinaryAPI),
    extractPublicId: cloudinaryAPI.extractPublicId.bind(cloudinaryAPI),
  };
};

/**
 * Hook for managing image state with Cloudinary operations
 */
export const useCloudinaryImage = (
  initialUrl: string = '',
  options: UseCloudinaryOptions = {}
) => {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const cloudinary = useCloudinary(options);

  const handleUploadSuccess = useCallback((response: CloudinaryUploadResponse) => {
    setImageUrl(response.secure_url);
    options.onUploadSuccess?.(response);
  }, [options.onUploadSuccess]);

  const handleDeleteSuccess = useCallback((response: CloudinaryDeleteResponse) => {
    setImageUrl('');
    options.onDeleteSuccess?.(response);
  }, [options.onDeleteSuccess]);

  const uploadImage = useCallback(async (file: File) => {
    const response = await cloudinary.uploadImage(file);
    if (response) {
      handleUploadSuccess(response);
    }
    return response;
  }, [cloudinary.uploadImage, handleUploadSuccess]);

  const deleteImage = useCallback(async (publicId?: string | null) => {
    if (!imageUrl) return null;
    
    const response = await cloudinary.deleteImage(imageUrl, publicId);
    if (response) {
      handleDeleteSuccess(response);
    }
    return response;
  }, [cloudinary.deleteImage, imageUrl, handleDeleteSuccess]);

  const setManualUrl = useCallback((url: string) => {
    setImageUrl(url);
  }, []);

  const clearImage = useCallback(() => {
    setImageUrl('');
  }, []);

  return {
    imageUrl,
    setImageUrl: setManualUrl,
    clearImage,
    uploadImage,
    deleteImage,
    isUploading: cloudinary.isUploading,
    isDeleting: cloudinary.isDeleting,
    uploadError: cloudinary.uploadError,
    deleteError: cloudinary.deleteError,
    uploadProgress: cloudinary.uploadProgress,
    resetUploadState: cloudinary.resetUploadState,
    resetDeleteState: cloudinary.resetDeleteState,
    validateImageUrl: cloudinary.validateImageUrl,
    getOptimizedUrl: cloudinary.getOptimizedUrl,
    extractPublicId: cloudinary.extractPublicId,
  };
};