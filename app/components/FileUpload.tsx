'use client';

import { useState, useRef } from 'react';

interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
}

interface FileUploadProps {
  onFileSelect?: (data: { url: string; filename: string }) => void;
  onBatchSelect?: (data: UploadResult[]) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

interface UploadProgress {
  [fileName: string]: number; // 0-100
}

export default function FileUpload({
  onFileSelect,
  onBatchSelect,
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 10,
  multiple = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesUpload = async (files: File[]) => {
    if (!files.length) return;

    // Validate files
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        validationErrors.push(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      } else if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        validationErrors.push(`${file.name} has invalid format`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      setError(validationErrors.join('; '));
      return;
    }

    if (!validFiles.length) return;

    setUploading(true);
    setError(null);
    setUploadProgress({});

    try {
      const formData = new FormData();
      validFiles.forEach(file => formData.append('file', file));
      formData.append('folder', 'product-images');
      if (validFiles.length > 1) {
        formData.append('batch', 'true');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      // Handle single file response
      if (result.url && result.filename && !Array.isArray(result.results)) {
        if (onFileSelect) {
          onFileSelect({ url: result.url, filename: result.filename });
        }
      }
      // Handle batch response
      else if (result.results && Array.isArray(result.results)) {
        const successful = result.results
          .filter((r: any) => r.success)
          .map((r: any) => ({
            url: r.url,
            filename: r.filename,
            originalName: r.originalName,
          }));

        if (onBatchSelect) {
          onBatchSelect(successful);
        }

        if (result.errors?.length > 0) {
          const errorList = result.errors
            .map((e: any) => `${e.filename}: ${e.error}`)
            .join('; ');
          setError(`${result.uploaded} uploaded, ${result.failed} failed: ${errorList}`);
        }
      }

      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length) {
      handleFilesUpload(multiple ? files : [files[0]]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = Array.from(event.dataTransfer.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length) {
      handleFilesUpload(multiple ? imageFiles : [imageFiles[0]]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const progressValues = Object.values(uploadProgress);
  const avgProgress = progressValues.length > 0 ? Math.round(progressValues.reduce((a, b) => a + b) / progressValues.length) : 0;

  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-bold text-black">{label}</label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:border-gray-500'
        } ${uploading ? 'opacity-75' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
          multiple={multiple}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p className="mt-2 text-sm text-black font-medium">Uploading... {avgProgress > 0 && `${avgProgress}%`}</p>
            {avgProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${avgProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-black">
              Drop image{multiple ? 's' : ''} here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-bold underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Max {maxSizeMB}MB each • JPG, PNG, GIF, WebP {multiple && '(multiple files allowed)'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
