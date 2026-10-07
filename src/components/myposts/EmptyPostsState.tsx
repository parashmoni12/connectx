import React from 'react';
import { Grid, SearchX, Plus, RefreshCw } from 'lucide-react';

interface EmptyPostsStateProps {
  searchQuery?: string;
  activeTab?: string;
  onClearSearch?: () => void;
  onCreateClick?: () => void;
}

export const EmptyPostsState: React.FC<EmptyPostsStateProps> = ({
  searchQuery,
  activeTab = 'all',
  onClearSearch,
  onCreateClick,
}) => {
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 bg-slate-900/40 border border-dashed border-slate-800/80 rounded-2xl text-center backdrop-blur-sm animate-fade-in">
      {/* Dynamic Icon */}
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
        {isSearching ? (
          <SearchX className="w-6 h-6 text-amber-400/90" />
        ) : (
          <Grid className="w-6 h-6 text-indigo-400/90" />
        )}
      </div>

      {/* Dynamic Messages */}
      <h3 className="text-sm md:text-base font-semibold text-slate-200">
        {isSearching ? `No posts matching "${searchQuery}"` : `No ${activeTab !== 'all' ? activeTab : ''} posts found`}
      </h3>

      <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        {isSearching
          ? 'Try checking for typos or searching with different keywords.'
          : activeTab === 'media'
          ? 'You haven’t published any posts containing images or video attachments yet.'
          : activeTab === 'saved'
          ? 'You haven’t bookmarked or saved any of your posts yet.'
          : 'You haven’t published any posts on ConnectX yet. Share an update or code snippet with your network!'}
      </p>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-3">
        {isSearching && onClearSearch && (
          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </button>
        )}

        {!isSearching && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Post</span>
          </button>
        )}
      </div>
    </div>
  );
};