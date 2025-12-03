'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const USERS = {
  mila: 'shark',
  thi: 'babyshark',
};

interface NailWork {
  id: string;
  imageUrl: string;
  description: string;
  artist: string;
  createdAt: string;
}

export default function NailPortfolioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [uploadedWorks, setUploadedWorks] = useState<NailWork[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload form state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('nail_portfolio_user');
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      loadWorks();
    }
  }, []);

  const loadWorks = () => {
    const works = localStorage.getItem('nail_portfolio_works');
    if (works) {
      setUploadedWorks(JSON.parse(works));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const validPassword = USERS[username as keyof typeof USERS];
    if (validPassword && validPassword === password) {
      localStorage.setItem('nail_portfolio_user', username);
      setIsAuthenticated(true);
      setCurrentUser(username);
      loadWorks();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nail_portfolio_user');
    setIsAuthenticated(false);
    setCurrentUser('');
    setUsername('');
    setPassword('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage || !description.trim()) {
      setUploadError('Please select an image and provide a description');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('description', description);
      formData.append('artist', currentUser);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/nail-portfolio/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Add to local works
      const newWork: NailWork = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        description,
        artist: currentUser,
        createdAt: new Date().toISOString(),
      };

      const updatedWorks = [newWork, ...uploadedWorks];
      setUploadedWorks(updatedWorks);
      localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));

      setUploadSuccess('Work uploaded successfully!');
      setSelectedImage(null);
      setImagePreview(null);
      setDescription('');

      setTimeout(() => {
        setUploadSuccess('');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-4 border-pink-300">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
              💅 Nail Artist Portfolio
            </h1>
            <p className="text-gray-600">Sign in to upload your work</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none text-gray-800"
                placeholder="mila or thi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none text-gray-800"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              💅 Nail Artist Portfolio
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {currentUser}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Work</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Image
              </label>
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg border-4 border-pink-300 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="w-full max-w-md h-64 border-4 border-dashed border-pink-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-all bg-pink-50">
                    <svg className="w-16 h-16 text-pink-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-pink-600 font-semibold">Click to upload image</span>
                    <span className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none text-gray-800"
                placeholder="Describe the nail design, colors used, techniques, etc..."
                required
              />
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading || !selectedImage || !description.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {uploading ? 'Uploading...' : 'Upload Work'}
            </button>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Uploading...</span>
                  <span className="font-bold text-pink-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            {uploadError && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg text-red-700">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg text-green-700">
                {uploadSuccess}
              </div>
            )}
          </form>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Portfolio</h2>

          {uploadedWorks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No works uploaded yet</p>
              <p className="text-sm mt-2">Upload your first nail design above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pink-200 hover:border-pink-400 transition-all">
                  <img
                    src={work.imageUrl}
                    alt={work.description}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-700 text-sm mb-2">{work.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="font-semibold text-pink-600">By {work.artist}</span>
                      <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
