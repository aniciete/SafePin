import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLinkedin,
  faTwitter,
  faYoutube,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import SafePinLogo from '@assets/SafePin Logo Green.svg';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const navigationLinks = {
    safepin: [
      { text: 'About us', url: '/about' },
      { text: 'FAQ', url: '/faq' },
      { text: 'Contact us', url: '/contact' },
      { text: 'Terms of Service', url: '/terms' },
      { text: 'Privacy policy', url: '/privacy' }
    ],
    support: [
      { text: 'Help center', url: '/help' },
      { text: 'Terms of service', url: '/terms' },
      { text: 'Privacy policy', url: '/privacy' },
      { text: 'Status', url: '/status' }
    ]
  };

  const socialLinks = [
    { icon: faLinkedin, url: 'https://linkedin.com/company/safepin', name: 'LinkedIn' },
    { icon: faTwitter, url: 'https://twitter.com/safepin', name: 'Twitter' },
    { icon: faYoutube, url: 'https://youtube.com/safepin', name: 'YouTube' },
    { icon: faInstagram, url: 'https://instagram.com/safepin', name: 'Instagram' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setSubscriptionStatus('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <img src={SafePinLogo} alt="SafePin" className="h-8 w-8" />
              SafePin
            </Link>
            <p className="text-gray-400 mb-6">
              Creating safer communities through technology and collaboration.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <FontAwesomeIcon icon={link.icon} className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">SafePin</h3>
            <ul className="space-y-2">
              {navigationLinks.safepin.map((link) => (
                <li key={link.text}>
                  <Link
                    to={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {navigationLinks.support.map((link) => (
                <li key={link.text}>
                  <Link
                    to={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for safety updates and community news.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Subscribe
              </button>
              {subscriptionStatus && (
                <p className="text-green-500 text-sm">{subscriptionStatus}</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SafePin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 