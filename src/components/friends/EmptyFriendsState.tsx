import React from 'react';
import { Users, UserPlus, SearchX, Sparkles } from 'lucide-react';
import type { FriendTab } from '../../types/friend';

interface EmptyFriendsStateProps {
  activeTab: FriendTab;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const EmptyFriendsState: React.FC<EmptyFriendsStateProps> = ({
  activeTab,
  searchQuery,
  onClearSearch,
}) => {
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 bg-slate-900/40 border border-dashed border-slate-800/80 rounded-2xl text-center backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
        {isSearching ? (
          <SearchX className="w-6 h-6 text-amber-400" />
        ) : activeTab === 'requests' ? (
          <UserPlus className="w-6 h-6 text-indigo-400" />
        ) : activeTab === 'suggestions' ? (
          <Sparkles className="w-6 h-6 text-sky-400" />
        ) : (
          <Users className="w-6 h-6 text-slate-400" />
        )}
      </div>

      <h3 className="text-sm md:text-base font-semibold text-slate-200">
        {isSearching
          ? `No users matching "${searchQuery}"`
          : activeTab === 'requests'
          ? 'No pending friend requests'
          : activeTab === 'suggestions'
          ? 'No new suggestions right now'
          : 'Your friends list is empty'}
      </h3>

      <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        {isSearching
          ? 'Try checking for typos or searching by full name or username.'
          : activeTab === 'requests'
          ? 'When someone sends you a friend request, it will show up here.'
          : activeTab === 'suggestions'
          ? 'Check back later for personalized connection recommendations.'
          : 'Search for colleagues or friends on ConnectX to build your network.'}
      </p>

      {isSearching && onClearSearch && (
        <button
          onClick={onClearSearch}
          className="mt-5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700/60"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};