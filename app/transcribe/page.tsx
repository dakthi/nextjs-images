'use client';

import { useState } from 'react';
import MainLayout from '../components/MainLayout';

interface TranscriptionResult {
  text: string;
  filename?: string;
}

export default function TranscribePage() {
  const [activeTab, setActiveTab] = useState<'file' | 'youtube'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeFormat, setYoutubeFormat] = useState<'audio' | 'video'>('audio');
  const [shouldTranscribe, setShouldTranscribe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState('');

  const API_BASE = 'https://transcribe.chartedconsultants.com';

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to transcribe: ${response.statusText}`);
      }

      const data = await response.json();
      setResult({
        text: data.text || data.transcription || JSON.stringify(data),
        filename: file.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe file');
    } finally {
      setLoading(false);
    }
  };

  const handleYoutubeDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/youtube/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: youtubeUrl,
          format: youtubeFormat,
          transcribe: shouldTranscribe,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to process YouTube video: ${response.statusText}`);
      }

      const data = await response.json();

      if (shouldTranscribe && (data.text || data.transcription)) {
        setResult({
          text: data.text || data.transcription,
          filename: data.filename || 'YouTube Video',
        });
      } else {
        setResult({
          text: `Downloaded successfully! ${data.file_id ? `File ID: ${data.file_id}` : ''}`,
          filename: data.filename,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process YouTube video');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0A1128] mb-2">Audio/Video Transcription</h1>
          <p className="text-[#C5A572]">Convert audio and video files to text using AI-powered transcription</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b-2 border-[#C5A572]/20">
          <button
            onClick={() => setActiveTab('file')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'file'
                ? 'text-[#0A1128] border-b-4 border-[#C5A572]'
                : 'text-gray-500 hover:text-[#0A1128]'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'youtube'
                ? 'text-[#0A1128] border-b-4 border-[#C5A572]'
                : 'text-gray-500 hover:text-[#0A1128]'
            }`}
          >
            YouTube Video
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#C5A572]/20">
          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A1128] mb-2">
                  Select Audio/Video File (Max 100MB)
                </label>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full p-3 border-2 border-[#C5A572]/30 rounded-lg focus:border-[#C5A572] focus:outline-none"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-[#C5A572] text-[#0A1128] font-bold py-3 px-6 rounded-lg hover:bg-[#0A1128] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#0A1128]"
              >
                {loading ? 'Transcribing...' : 'Transcribe File'}
              </button>
            </form>
          )}

          {/* YouTube Tab */}
          {activeTab === 'youtube' && (
            <form onSubmit={handleYoutubeDownload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A1128] mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border-2 border-[#C5A572]/30 rounded-lg focus:border-[#C5A572] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1128] mb-2">
                  Download Format
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="audio"
                      checked={youtubeFormat === 'audio'}
                      onChange={(e) => setYoutubeFormat('audio')}
                      className="w-4 h-4 text-[#C5A572] focus:ring-[#C5A572]"
                    />
                    <span className="text-[#0A1128]">Audio (MP3)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="video"
                      checked={youtubeFormat === 'video'}
                      onChange={(e) => setYoutubeFormat('video')}
                      className="w-4 h-4 text-[#C5A572] focus:ring-[#C5A572]"
                    />
                    <span className="text-[#0A1128]">Video (MP4)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shouldTranscribe}
                    onChange={(e) => setShouldTranscribe(e.target.checked)}
                    className="w-4 h-4 text-[#C5A572] focus:ring-[#C5A572] rounded"
                  />
                  <span className="text-[#0A1128] font-semibold">Transcribe audio automatically</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !youtubeUrl}
                className="w-full bg-[#C5A572] text-[#0A1128] font-bold py-3 px-6 rounded-lg hover:bg-[#0A1128] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#0A1128]"
              >
                {loading ? 'Processing...' : 'Download & Transcribe'}
              </button>
            </form>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0A1128]">
                  Transcription Result {result.filename && `- ${result.filename}`}
                </h3>
                <button
                  onClick={handleCopyToClipboard}
                  className="bg-[#0A1128] text-white px-4 py-2 rounded-lg hover:bg-[#C5A572] hover:text-[#0A1128] transition-all border-2 border-[#C5A572] font-semibold"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="p-4 bg-gray-50 border-2 border-[#C5A572]/30 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-[#0A1128] font-mono text-sm">
                  {result.text}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-[#0A1128] text-white p-6 rounded-lg border-2 border-[#C5A572]">
          <h3 className="text-lg font-bold mb-3 text-[#C5A572]">How to Use</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Upload File:</strong> Select an audio or video file (max 100MB) to transcribe</li>
            <li>• <strong>YouTube:</strong> Paste a YouTube URL to download and optionally transcribe the content</li>
            <li>• <strong>Supported Formats:</strong> MP3, MP4, WAV, M4A, and most common audio/video formats</li>
            <li>• <strong>Processing Time:</strong> Varies based on file length and size</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
