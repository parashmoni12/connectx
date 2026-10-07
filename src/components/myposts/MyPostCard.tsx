import React from 'react';
import { Globe, Lock, Edit3, Trash2, Heart, MessageSquare } from 'lucide-react';
import type { Post } from '../feed/PostCard';

interface MyPostCardProps {
  post: Post;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const MyPostCard: React.FC<MyPostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-lg flex flex-col gap-3 relative group">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-medium">
            {post.privacy === 'public' ? (
              <Globe className="w-3 h-3 text-sky-400" />
            ) : (
              <Lock className="w-3 h-3 text-amber-400" />
            )}
            <span className="capitalize">{post.privacy}</span>
          </span>
          <span>•</span>
          <span>{post.createdAt}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(post.id)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Post"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Delete Post"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="rounded-xl overflow-hidden max-h-72 border border-slate-800/80 bg-slate-950">
          <img src={post.mediaUrl} alt="Post Attachment" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-rose-400">
            <Heart className="w-3.5 h-3.5" /> {post.likesCount}
          </span>
          <span className="flex items-center gap-1 hover:text-indigo-400">
            <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}
          </span>
        </div>

        {post.tag && (
          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px] font-semibold border border-indigo-500/20">
            #{post.tag}
          </span>
        )}
      </div>
    </div>
  );
};