import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <TopNav />
      <div className="flex flex-1 relative">
        <Sidebar />
        {/* Main Content Area */}
        <main className="flex-1 lg:ml-[72px] pb-[72px] lg:pb-0">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
