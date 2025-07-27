import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import logo from '/SafePin Logo Green.svg';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- THIS IS THE FIX: The mobile header now matches the public header --- */}
        <header className="lg:hidden flex items-center justify-between h-16 bg-card border-b border-border px-4 flex-shrink-0">
          {/* Add the logo and brand name for context and consistent branding */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SafePin Logo" className="h-8" />
            <span className="text-2xl font-bold text-primary">SafePin</span>
          </Link>

          {/* This button will now be pushed to the right by justify-between */}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open sidebar">
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;