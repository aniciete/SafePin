import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { unsubscribeFromNewsletter, getDataPrivacyInfo } from '@/services/newsletter.service';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { toast } = useToast();
  
  const dataPrivacyInfo = getDataPrivacyInfo();

  useEffect(() => {
    // Pre-fill email if provided in URL parameters
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to unsubscribe.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await unsubscribeFromNewsletter(email, reason);
      
      if (result.success) {
        setIsUnsubscribed(true);
        toast({
          title: "Successfully Unsubscribed",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Successfully Unsubscribed</CardTitle>
            <CardDescription>
              You have been unsubscribed from our newsletter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Your Data Rights Under Philippine Law</h3>
              <p className="text-sm text-blue-700 mb-2">
                Under the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, your data will be handled as follows:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 ml-4">
                <li>• Your subscription data will be retained for 2 years for compliance purposes</li>
                <li>• You can request data deletion by contacting us</li>
                <li>• You can file complaints with the National Privacy Commission if needed</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-2">
                For privacy concerns or to exercise your data rights:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Contact us at <a href="/contact" className="text-blue-600 underline">our contact page</a></li>
                <li>• File a complaint with NPC: <a href="mailto:complaints@privacy.gov.ph" className="text-blue-600 underline">complaints@privacy.gov.ph</a></li>
                <li>• Call NPC hotline: <a href="tel:+6328234228" className="text-blue-600 underline">+63 2 8234 2228</a></li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Unsubscribe from Newsletter</CardTitle>
          <CardDescription>
            We're sorry to see you go. Please enter your email address to unsubscribe from our newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-2">
                Reason for Unsubscribing (Optional)
              </label>
              <textarea
                id="reason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Help us improve by telling us why you're unsubscribing..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Data Privacy Notice</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Under the <strong>Data Privacy Act of 2012 (RA 10173)</strong>:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                <li>• Your data will be retained for 2 years after unsubscription for compliance purposes</li>
                <li>• You can request data deletion by contacting us</li>
                <li>• You have the right to file complaints with the National Privacy Commission</li>
                <li>• Your unsubscription will be processed immediately</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !email.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Your Rights Under Philippine Law</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {dataPrivacyInfo.dataSubjectRights.map((right, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {right}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>National Privacy Commission Contact:</strong><br />
                Email: <a href="mailto:complaints@privacy.gov.ph" className="text-blue-600 underline">complaints@privacy.gov.ph</a><br />
                Phone: <a href="tel:+6328234228" className="text-blue-600 underline">+63 2 8234 2228</a><br />
                Website: <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">privacy.gov.ph</a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnsubscribePage;