import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, MessageSquare, Video, Settings, 
  Bookmark, User, Compass, Flame, Sparkles
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import type { NavItem } from '../../types';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const mainNavItems: NavItem[] = [
  { label: 'Home Feed', path: 'dashboard', icon: Home },
  { label: 'Explore', path: 'explore', icon: Compass },
  { label: 'My Post', path: 'mypost', icon: Flame },
  { label: 'Friends', path: 'friends', icon: Users },
  { label: 'Messages', path: 'chat', icon: MessageSquare },
  { label: 'Live Calls', path: 'calls', icon: Video },
];

const secondaryNavItems: NavItem[] = [
  { label: 'Saved Posts', path: 'saved', icon: Bookmark },
  { label: 'My Profile', path: 'profile', icon: User },
  { label: 'Settings', path: 'settings', icon: Settings },
];


export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  
  const user = {
    name: 'Alex Mercer',
    username: 'alexmercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3.5 px-3 py-2.5 md:px-3 lg:px-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
    }`;

  const sidebarContent = (

    <div className="flex flex-col h-full justify-between overflow-y-auto custom-scrollbar pr-1">

      <div className="space-y-6">
   
       

        {/* Main Navigation */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 hidden lg:block">
            Main Feeds
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} onClick={onCloseMobile} className={navLinkClass}>
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate md:hidden lg:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Account & Library */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 hidden lg:block">
            Personal Space
          </p>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} onClick={onCloseMobile} className={navLinkClass}>
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate md:hidden lg:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop / Laptop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-slate-800/70 bg-slate-950/60 p-3 lg:p-4 h-[calc(100vh-61px)] sticky top-[61px] backdrop-blur-sm transition-all duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800/80 p-4 z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};