import React from 'react';
import { Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Shield size={32} className="mr-2 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">SafePin</h2>
            </div>
            <p className="text-muted-foreground">
              Community-powered safety and crime reporting.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">SafePin</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline text-muted-foreground">About us</a></li>
              <li><a href="#" className="hover:underline text-muted-foreground">FAQ</a></li>
              <li><a href="#" className="hover:underline text-muted-foreground">Contact us</a></li>
              <li><a href="#" className="hover:underline text-muted-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:underline text-muted-foreground">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline text-muted-foreground">Legal</a></li>
              <li><a href="#" className="hover:underline text-muted-foreground">Status</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stay up to date</h3>
            <form>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                />
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-muted-foreground">
          <p>© 2025 SafePin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;