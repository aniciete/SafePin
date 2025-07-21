import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Shield size={32} className="mr-2" />
              <h2 className="text-2xl font-bold">SafePin</h2>
            </div>
            <p className="text-gray-300">
              Community-powered safety and crime reporting.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">SafePin</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About us</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Contact us</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Legal</a></li>
              <li><a href="#" className="hover:underline">Privacy policy</a></li>
              <li><a href="#" className="hover:underline">Status</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay up to date</h3>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 text-gray-900 bg-white border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-600 pt-6 text-center text-gray-400">
          <p>© 2025 SafePin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;