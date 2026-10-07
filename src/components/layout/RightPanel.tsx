import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Video, MessageSquare, UserPlus, Check, Search, ChevronRight } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import type { Friend } from '../../types';

interface SuggestedFriend {
  id: number;
  name: string;
  mutualFriends: number;
  avatar?: string;
}

// Simulated large dataset (e.g. 100+ friends)
const dummyFriends: Friend[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Friend ${i + 1}`,
  avatar: '',
  status: i % 2 === 0 ? 'Online' : 'In a call',
  isOnline: true,
}));

const initialSuggested: SuggestedFriend[] = Array.from({ length: 20 }, (_, i) => ({
  id: 101 + i,
  name: `Suggested User ${i + 1}`,
  mutualFriends: Math.floor(Math.random() * 15) + 1,
}));

export const RightPanel: React.FC = () => {
  const [requestedIds, setRequestedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSuggested, setShowAllSuggested] = useState(false);

  // Filter online friends based on search query
  const filteredFriends = useMemo(() => {
    return dummyFriends.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const visibleSuggested = showAllSuggested
    ? initialSuggested
    : initialSuggested.slice(0, 3); // Show top 3 by default

  const handleAddFriend = (id: number) => {
    setRequestedIds((prev) => [...prev, id]);
  };

  return (
    <aside className="w-72 bg-slate-900/50 border-l border-slate-800/80 p-4 hidden lg:flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-hidden">
      
      {/* 1. SEARCH BAR (Essential for 100+ items) */}
      <div className="relative mb-4 flex-none">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* 2. SUGGESTED FRIENDS (Collapsible / Compact) */}
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Suggested ({initialSuggested.length})
          </h3>
          <button
            onClick={() => setShowAllSuggested(!showAllSuggested)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5 transition-colors"
          >
            {showAllSuggested ? 'Collapse' : 'See All'}
            <ChevronRight className={`w-3 h-3 transition-transform ${showAllSuggested ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className={`space-y-2 ${showAllSuggested ? 'max-h-48 overflow-y-auto pr-1 custom-scrollbar' : ''}`}>
          {visibleSuggested.map((person) => {
            const isRequested = requestedIds.includes(person.id);
            return (
              <div
                key={person.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800/60 hover:bg-slate-800/70 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={person.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {person.mutualFriends} mutual friends
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddFriend(person.id)}
                  disabled={isRequested}
                  className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-medium transition-all ${
                    isRequested
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm active:scale-95'
                  }`}
                  title={isRequested ? 'Request Sent' : 'Add Friend'}
                >
                  {isRequested ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-800/80 mb-4 flex-none" />

      {/* 3. ONLINE FRIENDS (Flexible height container with dedicated scroll) */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2.5 flex-none">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Online Friends ({filteredFriends.length})
          </h3>
        </div>

        {/* Scrollable List Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
          {filteredFriends.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No friends found</p>
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={friend.name} isOnline={friend.isOnline} size="md" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                      {friend.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{friend.status}</p>
                  </div>
                </div>

                {/* Quick Action Links */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity flex-none">
                  <Link
                    to={`/chat/${friend.id}`}
                    title="Chat"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-700/50 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/app/voicecall`}
                    title="Voice Call"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/app/videocall`}
                    title="Start Video Call"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};