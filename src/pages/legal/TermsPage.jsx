import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        <p className="text-center text-muted-foreground mb-12">
          Last updated: July 2025
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Using Our Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Welcome to SafePin. By using our service, you agree to these terms. Please use our platform responsibly and only for its intended purpose of reporting incidents in the Philippines.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Your Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and truthful information when submitting a report.</li>
                <li>Do not submit false, misleading, or malicious reports. This is against Philippine law and may have serious consequences.</li>
                <li>Use our service for lawful purposes only.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Our Role and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                SafePin is a platform that connects you with Philippine authorities. We are not a law enforcement agency and cannot guarantee a response or outcome for any report submitted. <strong>For emergencies, always contact 911.</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> to understand how we handle your data in compliance with Philippine law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                These terms are governed by the laws of the Republic of the Philippines.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                If you have any questions about these terms, please contact us at <a href="mailto:legal@safepin.ph" className="text-primary hover:underline">legal@safepin.ph</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;