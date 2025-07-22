import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-900">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Shield size={32} className="mr-2 text-primary" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">SafePin</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-300">
              Community-powered safety and crime reporting.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">SafePin</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">About us</a></li>
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">FAQ</a></li>
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">Contact us</a></li>
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">Terms of Service</a></li>
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">Legal</a></li>
              <li><a href="#" className="hover:underline text-gray-600 dark:text-neutral-300">Status</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stay up to date</h3>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 text-gray-900 bg-white border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-neutral-700 pt-6 text-center text-gray-500 dark:text-neutral-400">
          <p>© 2025 SafePin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;