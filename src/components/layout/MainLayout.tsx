import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Header } from './Header';  
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { MobileBottomBar } from './MobileBottomBar';

export const MainLayout: React.FC = () => {

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-5 md:p-6 min-w-0 pb-24 md:pb-6 overflow-y-auto custom-scrollbar">
          <Outlet /> 
        </main>

        <RightPanel />
      </div>

      <MobileBottomBar />
    </div>
  );
};