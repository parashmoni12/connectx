import React, { useState } from 'react';
import { CreatePost } from './CreatePost';
import type { NewPostData } from './CreatePost';
import { PostCard } from './PostCard';
import type { Post } from './PostCard';


export const Feed: React.FC = () => {
  const currentUser = {
    name: 'Alex Mercer',
    username: 'alexmercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      author: {
        name: 'Sarah Connor',
        username: 'sarahc',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
      content: 'Just launched the new WebRTC video conferencing module for ConnectX! 🚀 Excited to hear everyone\'s feedback.',
      mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      tag: 'buildinpublic',
      privacy: 'public',
      createdAt: '2 hours ago',
      likesCount: 14,
      commentsCount: 3,
      isLiked: false,
    },
    {
      id: 'post-2',
      author: {
        name: 'David Miller',
        username: 'davidm',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      content: 'What are your favorite Tailwind CSS plugins for building dark mode dashboards?',
      privacy: 'public',
      createdAt: '5 hours ago',
      likesCount: 8,
      commentsCount: 7,
      isLiked: true,
    },
  ]);

  const handleCreatePost = (newPost: NewPostData) => {
    const created: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      content: newPost.content,
      mediaUrl: newPost.mediaUrl,
      tag: newPost.tag,
      privacy: newPost.privacy,
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };

    setPosts([created, ...posts]);
  };

  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <CreatePost currentUser={currentUser} onSubmitPost={handleCreatePost} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
        ))}
      </div>
    </div>
  );
};