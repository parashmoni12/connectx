import React from 'react';
import { Users, UserCheck, Sparkles, Search } from 'lucide-react';
import type { FriendTab } from '../../types/friend';

interface FriendsFilterProps {
  activeTab: FriendTab;
  onTabChange: (tab: FriendTab) => void;
  friendsCount: number;
  requestsCount: number;
  suggestionsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FriendsFilter: React.FC<FriendsFilterProps> = ({
  activeTab,
  onTabChange,
  friendsCount,
  requestsCount,
  suggestionsCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => onTabChange('all')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Friends ({friendsCount})</span>
        </button>

        <button
          onClick={() => onTabChange('requests')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'requests' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Requests {requestsCount > 0 && `(${requestsCount})`}</span>
        </button>

        <button
          onClick={() => onTabChange('suggestions')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'suggestions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Suggestions ({suggestionsCount})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search people..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
};