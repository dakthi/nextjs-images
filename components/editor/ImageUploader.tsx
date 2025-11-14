'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  productId: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft';
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export default function ImageUploader({
  productId,
  position,
  currentImageUrl,
  onUploadSuccess,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to R2
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      formData.append('imagePosition', position);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const positionLabel = {
    topLeft: 'Top Left',
    topRight: 'Top Right',
    bottomLeft: 'Bottom Left',
  }[position];

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {positionLabel} Image
      </label>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-800 text-xs rounded">
          {error}
        </div>
      )}

      {preview && (
        <div className="mb-3 relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt={`${positionLabel} preview`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-3 py-2 border rounded-lg text-sm cursor-pointer disabled:opacity-50"
      />

      {uploading && <p className="text-xs text-gray-600 mt-2">Uploading...</p>}
    </div>
  );
}
