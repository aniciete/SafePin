import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import EmergencyBanner from './EmergencyBanner';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;