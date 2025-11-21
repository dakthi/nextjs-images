'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';

interface ProductImage {
  id: string;
  versionId: string;
  imageUrl: string;
  imageType: string;
  position?: string;
  displayOrder: number;
  altText?: string;
  label?: string;
}

interface ImageManagerProps {
  versionId: string;
  images: ProductImage[];
  onImagesUpdated: (images: ProductImage[]) => void;
}

export default function ImageManager({ versionId, images, onImagesUpdated }: ImageManagerProps) {
  const [localImages, setLocalImages] = useState<ProductImage[]>(images);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const [newImage, setNewImage] = useState({
    imageUrl: '',
    imageType: 'main',
    position: 'top',
    altText: '',
    label: '',
  });

  const [editImage, setEditImage] = useState<Partial<ProductImage>>({});

  // Add single image
  const handleAddImage = async () => {
    if (!newImage.imageUrl.trim() || !newImage.imageType.trim()) {
      setError('Image URL and type are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/product-images/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          imageUrl: newImage.imageUrl,
          imageType: newImage.imageType,
          position: newImage.position || undefined,
          displayOrder: localImages.length,
          altText: newImage.altText || undefined,
          label: newImage.label || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to add image');
      const addedImage = await response.json();
      const updatedImages = [...localImages, addedImage];
      setLocalImages(updatedImages);
      onImagesUpdated(updatedImages);
      setNewImage({ imageUrl: '', imageType: 'main', position: 'top', altText: '', label: '' });
      setShowAddForm(false);
      setSuccess('Image added successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  // Add multiple images at once
  const handleAddMultipleImages = async (imagesToAdd: typeof newImage[]) => {
    if (imagesToAdd.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/product-images/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          imagesToAdd.map((img, idx) => ({
            versionId,
            imageUrl: img.imageUrl,
            imageType: img.imageType,
            position: img.position || undefined,
            displayOrder: localImages.length + idx,
            altText: img.altText || undefined,
            label: img.label || undefined,
          }))
        ),
      });

      if (!response.ok) throw new Error('Failed to add images');
      const addedImages = await response.json();
      const updatedImages = [...localImages, ...addedImages];
      setLocalImages(updatedImages);
      onImagesUpdated(updatedImages);
      setSuccess(`Added ${addedImages.length} image(s) successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add images');
    } finally {
      setLoading(false);
    }
  };

  // Update single image
  const handleUpdateImage = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/product-images/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editImage }),
      });

      if (!response.ok) throw new Error('Failed to update image');
      const updatedImage = await response.json();
      const updatedImages = localImages.map((img) => (img.id === id ? updatedImage : img));
      setLocalImages(updatedImages);
      onImagesUpdated(updatedImages);
      setEditingId(null);
      setEditImage({});
      setSuccess('Image updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
    } finally {
      setLoading(false);
    }
  };

  // Delete single image
  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/product-images/crud?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');
      const updatedImages = localImages.filter((img) => img.id !== id);
      setLocalImages(updatedImages);
      onImagesUpdated(updatedImages);
      setSuccess('Image deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  // Delete multiple images
  const handleDeleteMultiple = async () => {
    if (selectedImages.size === 0) {
      setError('No images selected');
      return;
    }

    if (!confirm(`Delete ${selectedImages.size} image(s)?`)) return;

    setLoading(true);
    try {
      const idsParam = Array.from(selectedImages).join(',');
      const response = await fetch(`/api/product-images/crud?ids=${idsParam}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete images');
      const updatedImages = localImages.filter((img) => !selectedImages.has(img.id));
      setLocalImages(updatedImages);
      onImagesUpdated(updatedImages);
      setSelectedImages(new Set());
      setSuccess(`Deleted ${selectedImages.size} image(s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete images');
    } finally {
      setLoading(false);
    }
  };

  // Reorder images via drag and drop
  const handleReorder = async (draggedId: string, targetId: string) => {
    const draggedIdx = localImages.findIndex((img) => img.id === draggedId);
    const targetIdx = localImages.findIndex((img) => img.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    const newImages = [...localImages];
    [newImages[draggedIdx], newImages[targetIdx]] = [newImages[targetIdx], newImages[draggedIdx]];

    // Update display order
    const updates = newImages.map((img, idx) => ({
      id: img.id,
      displayOrder: idx,
    }));

    setLoading(true);
    try {
      const response = await fetch('/api/product-images/crud', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', updates }),
      });

      if (!response.ok) throw new Error('Failed to reorder images');
      const reorderedImages = await response.json();
      setLocalImages(newImages);
      onImagesUpdated(newImages);
      setSuccess('Images reordered successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder images');
    } finally {
      setLoading(false);
      setDraggedItem(null);
    }
  };

  const toggleImageSelection = (id: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
      <h3 className="text-2xl font-bold text-black mb-4">Images ({localImages.length})</h3>

      {error && <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 border-2 border-green-500 text-green-700 rounded">{success}</div>}

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {showAddForm ? '× Cancel' : '+ Add Image'}
        </button>

        {selectedImages.size > 0 && (
          <button
            onClick={handleDeleteMultiple}
            className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            Delete {selectedImages.size} Selected
          </button>
        )}

        {selectedImages.size > 0 && (
          <button
            onClick={() => setSelectedImages(new Set())}
            className="bg-gray-500 text-white font-bold px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Add Image Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
          <h4 className="text-lg font-bold text-black mb-4">Add New Image</h4>
          <div className="space-y-4">
            <FileUpload
              label="Upload Image File"
              onFileSelect={(data) => setNewImage({ ...newImage, imageUrl: data.url })}
            />

            {newImage.imageUrl && (
              <div className="space-y-3">
                <img
                  src={newImage.imageUrl}
                  alt="Preview"
                  className="max-h-40 object-contain border-2 border-gray-300 rounded"
                />

                <select
                  value={newImage.imageType}
                  onChange={(e) => setNewImage({ ...newImage, imageType: e.target.value })}
                  className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
                >
                  <option value="main">Main</option>
                  <option value="thumbnail">Thumbnail</option>
                  <option value="detail">Detail</option>
                  <option value="side">Side</option>
                  <option value="back">Back</option>
                </select>

                <select
                  value={newImage.position}
                  onChange={(e) => setNewImage({ ...newImage, position: e.target.value })}
                  className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>

                <input
                  type="text"
                  placeholder="Alt Text (optional)"
                  value={newImage.altText}
                  onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                  className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
                />

                <input
                  type="text"
                  placeholder="Label (optional)"
                  value={newImage.label}
                  onChange={(e) => setNewImage({ ...newImage, label: e.target.value })}
                  className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAddImage}
                    className="flex-1 bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Image'}
                  </button>
                  <button
                    onClick={() => setNewImage({ imageUrl: '', imageType: 'main', position: 'top', altText: '', label: '' })}
                    className="flex-1 bg-gray-500 text-white font-bold px-6 py-2 rounded hover:bg-gray-600"
                  >
                    × Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Images Grid */}
      {localImages.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No images yet. Add your first image!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {localImages.map((image) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => setDraggedItem(image.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedItem) handleReorder(draggedItem, image.id);
              }}
              className={`relative border-2 rounded-lg overflow-hidden cursor-move transition-opacity ${
                selectedImages.has(image.id)
                  ? 'border-blue-600 opacity-75 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              {/* Image */}
              <img
                src={image.imageUrl}
                alt={image.altText || image.label || 'Product image'}
                className="w-full h-40 object-cover"
              />

              {/* Info */}
              <div className="p-2 bg-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-black line-clamp-1">{image.label || image.imageType}</p>
                    <p className="text-xs text-gray-600">{image.position || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Edit Mode */}
              {editingId === image.id ? (
                <div className="absolute inset-0 bg-white p-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="URL"
                      defaultValue={image.imageUrl}
                      onChange={(e) => setEditImage({ ...editImage, imageUrl: e.target.value })}
                      className="w-full border-2 border-gray-400 rounded px-2 py-1 text-xs text-black"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      defaultValue={image.label || ''}
                      onChange={(e) => setEditImage({ ...editImage, label: e.target.value })}
                      className="w-full border-2 border-gray-400 rounded px-2 py-1 text-xs text-black"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateImage(image.id)}
                      className="flex-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded hover:bg-green-700"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(image.id);
                      setEditImage(image);
                    }}
                    className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-600 mt-4">Tip: Drag images to reorder them</p>
    </div>
  );
}
