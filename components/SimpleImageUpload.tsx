// components/SimpleImageUpload.tsx
'use client'
import { 
  CldUploadWidget, 
  type CloudinaryUploadWidgetResults, 
  type CloudinaryUploadWidgetError 
} from 'next-cloudinary';
import { useState } from 'react';

const SimpleImageUpload: React.FC = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  // Debug environment variables
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  const handleSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (typeof results.info === 'object' && results.info && 'secure_url' in results.info) {
      setUploadedUrl(results.info.secure_url);
      console.log('Upload success:', results.info);
    }
  };

  const handleError = (error: CloudinaryUploadWidgetError) => {
    console.error('Upload error:', error);
    alert('Upload gagal!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Simple Upload</h2>
      
      <CldUploadWidget
        uploadPreset="nextjs-unsigned-upload" // Sesuai dengan nama preset di screenshot
        onSuccess={handleSuccess}
        onError={handleError}
        options={{
          // folder: 'uploads', // Hapus ini karena sudah diset di preset sebagai 'folder/gwt'
          maxFiles: 1,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          maxFileSize: 10000000, // 10MB
          sources: ['local', 'camera'],
          multiple: false,
          publicId: `photo-${Date.now()}`, // Custom nama file (hanya jika preset allow)
        }}
      >
        {({ open }: { open: () => void }) => (
          <button
            onClick={() => open()}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>

      {uploadedUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Uploaded Image:</h3>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-md border"
          />
          <p className="text-sm text-gray-600 mt-2 break-all">
            {uploadedUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUpload;