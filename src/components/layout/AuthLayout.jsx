import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // Import the theme toggle

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10" />
          <span className="text-3xl font-bold text-primary">SafePin</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} SafePin. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;