import React from 'react';
import { Plus } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface MyPostsHeaderProps {
  userName: string;
  onCreateClick?: () => void;
}

export const MyPostsHeader: React.FC<MyPostsHeaderProps> = ({ userName, onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Avatar name={userName} size="lg" />
        <div>
          <h1 className="text-lg font-bold text-slate-100">My Published Posts</h1>
          <p className="text-xs text-slate-400">Manage, edit, or track performance of your posts</p>
        </div>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Post</span>
      </button>
    </div>
  );
};