'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

interface RSSFeed {
  id?: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
}

export default function RSSFeedPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null);
  const [feedForm, setFeedForm] = useState({ name: '', url: '', category: '' });

  const categories = ['all', 'UK News', 'Business', 'Money', 'Real Estate', 'Immigration', 'Law & Policy'];

  useEffect(() => {
    fetchSavedFeeds();
  }, []);

  useEffect(() => {
    if (feeds.length > 0 && feeds.some(f => f.enabled)) {
      fetchFeeds();
    }
  }, [feeds]);

  const fetchSavedFeeds = async () => {
    try {
      const response = await fetch('/api/rss/crud');
      if (response.ok) {
        const data = await response.json();
        setFeeds(data.map((f: any) => ({ ...f, enabled: f.isEnabled })));
      }
    } catch (error) {
      console.error('Failed to fetch feeds:', error);
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rss/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedForm.name,
          url: feedForm.url,
          category: feedForm.category,
          isEnabled: true,
        }),
      });

      if (response.ok) {
        await fetchSavedFeeds();
        setShowAddModal(false);
        setFeedForm({ name: '', url: '', category: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add feed');
      }
    } catch (error) {
      console.error('Failed to add feed:', error);
      alert('Failed to add feed');
    }
  };

  const handleUpdateFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeed) return;

    try {
      const response = await fetch('/api/rss/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingFeed.id,
          name: feedForm.name,
          url: feedForm.url,
          category: feedForm.category,
        }),
      });

      if (response.ok) {
        await fetchSavedFeeds();
        setEditingFeed(null);
        setFeedForm({ name: '', url: '', category: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update feed');
      }
    } catch (error) {
      console.error('Failed to update feed:', error);
      alert('Failed to update feed');
    }
  };

  const handleDeleteFeed = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;

    try {
      const response = await fetch(`/api/rss/crud?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSavedFeeds();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete feed');
      }
    } catch (error) {
      console.error('Failed to delete feed:', error);
      alert('Failed to delete feed');
    }
  };

  const startEdit = (feed: RSSFeed) => {
    setEditingFeed(feed);
    setFeedForm({ name: feed.name, url: feed.url, category: feed.category });
  };

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rss/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeds: feeds.filter(f => f.enabled).map(f => ({ url: f.url, source: f.name, category: f.category }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch RSS feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeed = (index: number) => {
    const newFeeds = [...feeds];
    newFeeds[index].enabled = !newFeeds[index].enabled;
    setFeeds(newFeeds);
  };

  const filteredItems = selectedCategory === 'all'
    ? feedItems
    : feedItems.filter(item => item.source.includes(selectedCategory));

  return (
    <MainLayout>
      <div className="max-w-6xl">
        <h1 className="text-4xl font-bold text-black mb-2">News Feed Aggregator</h1>
        <p className="text-xl text-black font-semibold mb-8">Marketing team news sources for article writing</p>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Feed Sources */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0A1128]/20 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">News Sources</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#C5A572] text-white font-bold px-3 py-1 rounded-md hover:bg-[#0A1128] transition-colors text-sm"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {feeds.map((feed, index) => (
                  <div key={feed.id || index} className="flex items-start gap-2 p-2 hover:bg-[#0A1128]/5 rounded group">
                    <input
                      type="checkbox"
                      checked={feed.enabled}
                      onChange={() => toggleFeed(index)}
                      className="w-4 h-4 mt-1 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-black text-sm">{feed.name}</div>
                      <div className="text-xs text-black/60 truncate">{feed.category}</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(feed)}
                        className="text-[#C5A572] hover:text-[#0A1128] text-xs px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFeed(feed.id!)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={fetchFeeds}
                disabled={loading || feeds.filter(f => f.enabled).length === 0}
                className="w-full mt-4 bg-[#C5A572] text-white font-bold px-4 py-3 rounded-md hover:bg-[#0A1128] transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Right: News Feed */}
          <div className="col-span-2">
            {/* Category Filter */}
            <div className="mb-4 flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#C5A572] text-white'
                      : 'bg-white text-black border-2 border-[#0A1128]/20 hover:bg-[#0A1128]/5'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* News Items */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0A1128]/20 text-center">
                  <p className="text-black">Loading news articles...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0A1128]/20 text-center">
                  <p className="text-black/60">
                    {feedItems.length === 0
                      ? 'Loading articles from selected sources...'
                      : 'No articles found for this category'}
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0A1128]/20 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-black text-lg flex-1">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A572]">
                          {item.title}
                        </a>
                      </h3>
                      <span className="text-xs bg-[#C5A572] text-white px-2 py-1 rounded font-bold ml-2 whitespace-nowrap">
                        {item.source}
                      </span>
                    </div>
                    <p className="text-sm text-black/70 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center text-xs text-black/50">
                      <span>{new Date(item.pubDate).toLocaleDateString()} {new Date(item.pubDate).toLocaleTimeString()}</span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C5A572] hover:text-[#0A1128] font-medium"
                      >
                        Read Full Article →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Feed Modal */}
        {(showAddModal || editingFeed) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowAddModal(false);
              setEditingFeed(null);
              setFeedForm({ name: '', url: '', category: '' });
            }}
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold text-black mb-6">
                {editingFeed ? 'Edit RSS Feed' : 'Add New RSS Feed'}
              </h2>
              <form onSubmit={editingFeed ? handleUpdateFeed : handleAddFeed} className="space-y-5">
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Feed Name *</label>
                  <input
                    type="text"
                    value={feedForm.name}
                    onChange={(e) => setFeedForm({ ...feedForm, name: e.target.value })}
                    required
                    placeholder="e.g., Sky News - UK"
                    className="w-full border-2 border-[#0A1128]/30 rounded px-4 py-3 text-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Feed URL *</label>
                  <input
                    type="url"
                    value={feedForm.url}
                    onChange={(e) => setFeedForm({ ...feedForm, url: e.target.value })}
                    required
                    placeholder="https://feeds.example.com/rss.xml"
                    className="w-full border-2 border-[#0A1128]/30 rounded px-4 py-3 text-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Category *</label>
                  <select
                    value={feedForm.category}
                    onChange={(e) => setFeedForm({ ...feedForm, category: e.target.value })}
                    required
                    className="w-full border-2 border-[#0A1128]/30 rounded px-4 py-3 text-black font-medium"
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c !== 'all').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#C5A572] text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128] transition-colors"
                  >
                    {editingFeed ? 'Update Feed' : 'Add Feed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingFeed(null);
                      setFeedForm({ name: '', url: '', category: '' });
                    }}
                    className="flex-1 bg-[#0A1128]/20 text-black font-bold px-6 py-3 rounded-md hover:bg-[#0A1128]/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
