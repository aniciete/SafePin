import { useNavigate } from 'react-router-dom';
import Modal from './index';

function AuthorityModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleRedirect = (type) => {
    if (type === 'admin') {
      navigate('/admin-login');
    } else if (type === 'authority') {
      navigate('/authority-login');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Login Type">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleRedirect('admin')}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Admin Login
        </button>
        <button
          onClick={() => handleRedirect('authority')}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Authority Login
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default AuthorityModal; 