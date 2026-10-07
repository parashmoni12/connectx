import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Video, Users, Compass } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  
  const bottomNavs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Friends', path: '/friends', icon: Users },
    { label: 'Chat', path: '/chat', icon: MessageSquare },
    { label: 'Calls', path: '/calls', icon: Video },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl px-3 py-2 flex items-center justify-between shadow-2xl shadow-indigo-950/40 md:hidden">
      {bottomNavs.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};