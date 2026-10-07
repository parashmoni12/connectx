import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Video, Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { IconButton } from '../common/IconButton';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const user = {
    name: 'Alex Mercer',
    username: 'alexmercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/70 px-3 md:px-6 py-2.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu Trigger & Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation drawer"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
            X
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white  xs:inline-block">
            Connect<span className="text-indigo-400">X</span>
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden sm:block flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts, friends, topics..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 text-slate-400 hover:text-white sm:hidden"
          aria-label="Search button"
        >
          <Search className="w-5 h-5" />
        </button>

       {/* Hidden on mobile, visible on tablet (md: 768px+) and laptop/desktop (lg) */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          <IconButton icon={Video} label="Video Calls" />
          <IconButton icon={MessageSquare} badge={3} label="Messages" />
          <IconButton icon={Bell} badge={5} label="Notifications" />
        </div>

        <div className="h-6 w-[1px] bg-slate-800/80 mx-1.5 hidden sm:block" />

        {/* User Profile Trigger with Name & Handle */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Avatar name={user.name} src={user.avatar} isOnline={user.isOnline} size="md" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-100">{user.name}</p>
              <p className="text-[10px] font-medium text-slate-400">@{user.username}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 ">
              <div className="px-3 py-2 border-b border-slate-800/60 mb-1 md:hidden">
                <p className="text-xs font-bold text-slate-100">{user.name}</p>
                <p className="text-[10px] text-slate-400">@{user.username}</p>
              </div>
              <button className="w-full  cursor-pointer flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-xl transition-colors">
                <User className="w-4 h-4 text-slate-400" />
                View Profile
              </button>
              <button className="w-full flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-xl transition-colors">
                <Settings className="w-4 h-4 text-slate-400" />
                Settings & Privacy
              </button>
              <div className="h-[1px] bg-slate-800/60 my-1" />
              <button className="w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 bg-slate-950 border-b border-slate-800 p-3 flex items-center gap-2 sm:hidden z-50">
          <input
            type="text"
            placeholder="Search ConnectX..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            autoFocus
          />
          <button onClick={() => setShowMobileSearch(false)} className="p-1.5 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};