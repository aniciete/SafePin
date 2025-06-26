import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '@components/Modal';
import SafePinLogo from '@assets/SafePin Logo Green.svg';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAuthRedirect = (type) => {
    closeModal();
    navigate(type === 'admin' ? '/admin-login' : '/authority-login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={SafePinLogo} alt="SafePin Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-green-600">SafePin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-green-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600">About Us</Link>
            <Link to="/report" className="text-gray-600 hover:text-green-600">Report</Link>
            <button
              onClick={openModal}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Authority Access
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-green-600">About Us</Link>
              <Link to="/report" className="text-gray-600 hover:text-green-600">Report</Link>
              <button
                onClick={openModal}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Authority Access
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Authority Access Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Choose Login Type">
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleAuthRedirect('admin')}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Admin Login
          </button>
          <button
            onClick={() => handleAuthRedirect('authority')}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Authority Login
          </button>
          <button
            onClick={closeModal}
            className="w-full bg-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </header>
  );
}

export default Header; 