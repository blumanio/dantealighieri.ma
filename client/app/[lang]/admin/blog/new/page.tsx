'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2, Save, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewPostPage({ params }: { params: Promise<{ lang: string }> }) {
  // Unwrap params using React.use() or await if async component, but this is a Client Component
  // In Next 15+ params is a Promise, for now treating as standard client usage
  const { lang } = React.use(params);
  
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    coverImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/generated-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          author: user?.fullName || 'Admin',
          authorId: user?.id,
          lang: lang,
          // Defaults required by your Schema
          communityType: 'General',
          communityName: 'Blog',
          communitySlug: 'blog',
          category: 'academic'
        }),
      });

      if (res.ok) {
        alert('Post created successfully!');
        setFormData({ title: '', slug: '', excerpt: '', content: '', tags: '', coverImage: '' });
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to create post'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900">Write New Article ({lang})</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Article Title</label>
              <Input 
                className="text-lg font-bold"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. How to Win ERSU 2026"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Content (MDX Supported)
              </label>
              <div className="relative">
                <textarea 
                  className="w-full p-4 border border-slate-200 rounded-xl font-mono text-sm h-[600px] focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="# Introduction&#10;&#10;Write your content here...&#10;&#10;<LeadMagnet type='visa' variant='inline' />"
                />
                <div className="absolute top-4 right-4 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded pointer-events-none">
                  Markdown + Components
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Available components: <code>&lt;LeadMagnet type="scholarship|visa|university" /&gt;</code>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Meta Data
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug (URL)</label>
              <Input 
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                placeholder="how-to-win-ersu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Excerpt</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Short summary for SEO..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags</label>
              <Input 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="scholarship, visa, italy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cover Image URL</label>
              <div className="flex gap-2">
                <Input 
                  value={formData.coverImage}
                  onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  placeholder="/images/..."
                />
                <div className="p-2 bg-slate-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Publish Post</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}