import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/config/supabase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !hasConsented) {
      toast({
        title: "Consent Required",
        description: "Please enter your email and agree to the Privacy Policy.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message,
      });
      setEmail('');
      setHasConsented(false);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            {/* --- REPLACED LOGO WITH TEXT --- */}
            <h2 className="text-2xl font-bold text-primary mb-2">SafePin</h2>
            <p className="text-muted-foreground text-sm">
              Your partner in community safety.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline text-muted-foreground">About us</a></li>
              <li><a href="/faq" className="hover:underline text-muted-foreground">FAQ</a></li>
              <li><a href="/contact" className="hover:underline text-muted-foreground">Contact us</a></li>
              <li><a href="/status" className="hover:underline text-muted-foreground">Status</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:underline text-muted-foreground">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:underline text-muted-foreground">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stay up to date</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pr-28"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !hasConsented}
                  className="absolute top-1/2 right-1 -translate-y-1/2 h-auto py-1.5 px-3"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={hasConsented}
                  onChange={(e) => setHasConsented(e.target.checked)}
                  className="mt-0.5"
                  disabled={isSubmitting}
                />
                <label htmlFor="consent" className="text-xs text-muted-foreground leading-tight">
                  I agree to the <a href="/privacy" className="underline font-medium">Privacy Policy</a> and consent to receive newsletter updates.
                </label>
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