import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import Home from '@pages/Home';
import About from '@pages/About';
import Report from '@pages/Report';
import Verification from '@pages/Verification';
import AdminLogin from '@pages/AdminLogin';
import AuthorityLogin from '@pages/AuthorityLogin';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="report" element={<Report />} />
        <Route path="verify" element={<Verification />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="authority-login" element={<AuthorityLogin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App; 