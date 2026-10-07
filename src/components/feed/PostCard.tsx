import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal, Globe, Lock, Bookmark, Send } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export interface CommentItem {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  mediaUrl?: string;
  tag?: string;
  privacy: 'public' | 'friends';
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  comments?: CommentItem[];
  isLiked?: boolean;
  isSaved?: boolean;
}

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle }) => {
  const [saved, setSaved] = useState(post.isSaved || false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Local state for comments list & count
  const [commentsList, setCommentsList] = useState<CommentItem[]>(
    post.comments || [
      {
        id: 'c1',
        author: { name: 'Sarah Connor' },
        text: 'Great update! Looking forward to seeing more.',
        createdAt: '2m ago',
      },
    ]
  );
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || commentsList.length);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: {
        name: 'You',
      },
      text: commentText.trim(),
      createdAt: 'Just now',
    };

    setCommentsList((prev) => [...prev, newComment]);
    setCommentsCount((prev) => prev + 1);
    setCommentText('');
  };

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={post.author.name} src={post.author.avatar} size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-100">{post.author.name}</h3>
              <span className="text-[10px] text-slate-500">@{post.author.username}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{post.createdAt}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {post.privacy === 'public' ? (
                  <Globe className="w-3 h-3 text-sky-400" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-400" />
                )}
                {post.privacy}
              </span>
            </div>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Text Body */}
      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{post.content}</p>

      {/* Tag */}
      {post.tag && (
        <span className="inline-block px-2.5 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-semibold">
          #{post.tag}
        </span>
      )}

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96 bg-slate-950">
          <img src={post.mediaUrl} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
        </div>
      )}

      {/* Stats Bar (Now clickable for comments) */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>{post.likesCount} likes</span>
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="hover:text-indigo-400 hover:underline transition-colors"
        >
          {commentsCount} comments
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
        <button
          onClick={() => onLikeToggle(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            post.isLiked ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            saved ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Save</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Expanded Comments Section */}
      {showCommentBox && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
          {/* Comment Feed */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {commentsList.map((item) => (
              <div key={item.id} className="flex gap-2.5 items-start">
                <Avatar name={item.author.name} src={item.author.avatar} size="xs" />
                <div className="flex-1 bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200 text-[11px]">{item.author.name}</span>
                    <span className="text-[9px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Input Box */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};