import React, { useState } from 'react';
import { MyPostsHeader } from '../components/myposts/MyPostsHeader';
import { MyPostsFilter } from '../components/myposts/MyPostsFilter';
import type { FilterTab } from '../components/myposts/MyPostsFilter';
import { MyPostCard } from '../components/myposts/MyPostCard';
import type { Post } from '../components/feed/PostCard';
import { Grid } from 'lucide-react';

export const MyPostsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [myPosts, setMyPosts] = useState<Post[]>([
    {
      id: 'mp1',
      author: { name: 'Alex Mercer', username: 'alexmercer', avatar: '' },
      content: 'Just deployed the new real-time voice and video features on ConnectX! 🚀',
      tag: 'ConnectX',
      privacy: 'public',
      createdAt: '2 hours ago',
      likesCount: 24,
      commentsCount: 5,
    },
    {
      id: 'mp2',
      author: { name: 'Alex Mercer', username: 'alexmercer', avatar: '' },
      content: 'Building custom React hooks for Tailwind styling and UI state management.',
      mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      tag: 'ReactJS',
      privacy: 'friends',
      createdAt: 'Yesterday',
      likesCount: 42,
      commentsCount: 12,
    },
  ]);

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setMyPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const filteredPosts = myPosts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'media') return matchesSearch && !!post.mediaUrl;
    if (activeTab === 'saved') return matchesSearch && post.isSaved;
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 md:p-6 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
      <MyPostsHeader userName="Alex Mercer" />

      <MyPostsFilter
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalCount={myPosts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <MyPostCard
              key={post.id}
              post={post}
              onEdit={(id) => alert(`Edit post ${id}`)}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-center">
            <Grid className="w-8 h-8 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-300">No posts found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery ? 'Try adjusting your search query' : 'You haven’t created any posts in this category yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};