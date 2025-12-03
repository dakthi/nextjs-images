'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';

interface NailWork {
  id: string;
  imageUrl: string;
  description: string;
  artist: string;
  createdAt: string;
}

export default function NailPortfolioManagePage() {
  const [uploadedWorks, setUploadedWorks] = useState<NailWork[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<NailWork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [artists, setArtists] = useState<string[]>([]);

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    filterWorks();
  }, [uploadedWorks, searchTerm, selectedArtist]);

  const loadWorks = () => {
    const works = localStorage.getItem('nail_portfolio_works');
    if (works) {
      const parsed = JSON.parse(works);
      setUploadedWorks(parsed);

      // Extract unique artists
      const uniqueArtists = Array.from(new Set(parsed.map((w: NailWork) => w.artist)));
      setArtists(uniqueArtists as string[]);
    }
  };

  const filterWorks = () => {
    let filtered = [...uploadedWorks];

    // Filter by artist
    if (selectedArtist !== 'all') {
      filtered = filtered.filter(work => work.artist === selectedArtist);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(work =>
        work.description.toLowerCase().includes(term) ||
        work.artist.toLowerCase().includes(term)
      );
    }

    setFilteredWorks(filtered);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;

    const updatedWorks = uploadedWorks.filter(work => work.id !== id);
    setUploadedWorks(updatedWorks);
    localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));
  };

  const handleDeleteAll = () => {
    if (!confirm('Are you sure you want to delete ALL works? This cannot be undone!')) return;

    localStorage.removeItem('nail_portfolio_works');
    setUploadedWorks([]);
    setFilteredWorks([]);
    setArtists([]);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Nail Portfolio Management</h1>
          <p className="text-xl text-black font-semibold">Manage uploaded nail art works</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#0A1128]/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by description or artist..."
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
              />
            </div>

            {/* Artist Filter */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">Filter by Artist</label>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black font-medium"
              >
                <option value="all">All Artists</option>
                {artists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-end">
              <div className="bg-[#C5A572]/10 p-3 rounded-md border-2 border-[#C5A572]/30">
                <p className="text-sm font-semibold text-black">
                  Showing {filteredWorks.length} of {uploadedWorks.length} works
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => window.location.href = '/nail-portfolio/uploads'}
              className="bg-[#C5A572] text-white font-bold px-6 py-2 rounded-md hover:bg-[#0A1128] transition-colors"
            >
              Go to Upload Page
            </button>
            {uploadedWorks.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete All Works
              </button>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-2 border-[#0A1128]/20">
          <h2 className="text-2xl font-bold text-black mb-6">
            Portfolio Gallery
            {selectedArtist !== 'all' && ` - ${selectedArtist}`}
          </h2>

          {filteredWorks.length === 0 ? (
            <div className="text-center py-12 text-black/60">
              <p className="text-lg">
                {uploadedWorks.length === 0
                  ? 'No works uploaded yet'
                  : 'No works match your filters'}
              </p>
              <p className="text-sm mt-2">
                {uploadedWorks.length === 0
                  ? 'Artists can upload their work from the upload page'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-[#0A1128]/20 hover:border-[#C5A572] transition-all group">
                  <div className="relative">
                    <img
                      src={work.imageUrl}
                      alt={work.description}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => handleDelete(work.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white font-bold px-3 py-1 rounded-md hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-black text-sm mb-3 line-clamp-3">{work.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#C5A572] bg-[#C5A572]/10 px-2 py-1 rounded">
                        {work.artist}
                      </span>
                      <span className="text-black/60">
                        {new Date(work.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
