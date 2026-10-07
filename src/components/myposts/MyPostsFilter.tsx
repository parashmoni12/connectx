import React from 'react';
import { Grid, Image as ImageIcon, Bookmark, Search } from 'lucide-react';

export type FilterTab = 'all' | 'media' | 'saved';

interface MyPostsFilterProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MyPostsFilter: React.FC<MyPostsFilterProps> = ({
  activeTab,
  onTabChange,
  totalCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto">
        <button
          onClick={() => onTabChange('all')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>All ({totalCount})</span>
        </button>

        <button
          onClick={() => onTabChange('media')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'media' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Media</span>
        </button>

        <button
          onClick={() => onTabChange('saved')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search my posts..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};