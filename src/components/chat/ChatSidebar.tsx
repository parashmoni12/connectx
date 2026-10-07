import React from 'react';
import { Hash, MessageSquare, Search, Plus } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import type { Conversation, Message } from '../types/chat';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, activeId, onSelect }) => {
  const channels = conversations.filter((c) => c.type === 'channel');
  const dms = conversations.filter((c) => c.type === 'dm' || c.type === 'group');

  return (
    <div className="w-full md:w-80 flex-none bg-slate-900/90 border-r border-slate-800 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-3.5 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels & messages..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Public Channels */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 mb-1.5 uppercase tracking-wider">
            <span>Channels</span>
            <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                  activeId === item.id
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Hash className="w-4 h-4 opacity-70" />
                <span className="truncate flex-1 text-left">{item.name}</span>
                {item.unreadCount ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full">
                    {item.unreadCount}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 mb-1.5 uppercase tracking-wider">
            <span>Direct Messages</span>
            <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {dms.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                  activeId === item.id
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Avatar name={item.name} size="xs" />
                  {item.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="truncate text-slate-200 font-medium">{item.name}</p>
                  {item.lastMessage && (
                    <p className="truncate text-[10px] text-slate-500">{item.lastMessage}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};