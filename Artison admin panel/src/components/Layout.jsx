import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#fdfbf7] overflow-hidden text-[#2d2626]">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay */}
        {!isCollapsed && (
          <div 
            className="absolute inset-0 bg-[#3b2f2f]/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}

        {/* Sidebar Wrapper */}
        <div 
          className={`
            absolute md:relative z-50 h-full shrink-0 bg-[#fdfbf7] border-[#eae0d5] overflow-hidden
            transition-all duration-300 ease-in-out
            ${isCollapsed 
                ? '-translate-x-full md:translate-x-0 md:w-0 border-r-0' 
                : 'translate-x-0 w-64 border-r'
            }
          `}
        >
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
        
        {/* Toggle button */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-1 z-100 hidden md:flex items-center justify-center w-8 h-8 bg-white border border-[#eae0d5] rounded-full shadow-sm text-[#5a4d4d] hover:text-[#c39a5c] hover:border-[#c39a5c] transition-all duration-300 ease-in-out"
          style={{ 
            left: isCollapsed ? '0px' : '16rem', 
            transform: isCollapsed ? 'translateX(0.5rem)' : 'translateX(-50%)' 
          }}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        
        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto bg-white p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
