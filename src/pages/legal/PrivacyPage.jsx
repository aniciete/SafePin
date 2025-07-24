import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <p className="text-center text-muted-foreground mb-12">
          Last updated: July 2025
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                SafePin is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights under the Philippine Data Privacy Act of 2012 (RA 10173).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. What We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Report Information:</strong> Details you provide about an incident, such as description, location, and any uploaded media.</li>
                <li><strong>Contact Information (Optional):</strong> Your name or email, if you choose to provide it for non-anonymous reports.</li>
                <li><strong>Technical Data:</strong> Your IP address, browser type, and device information to help us secure and improve our service.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To submit your report to the appropriate authorities.</li>
                <li>To provide you with status updates on your report.</li>
                <li>To improve the safety and security of our platform.</li>
                <li>To comply with legal obligations in the Philippines.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Who We Share Your Information With</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                We only share your report details with verified Philippine authorities and law enforcement agencies to ensure your report is addressed. We will never sell your personal data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Your Rights as a Data Subject</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">
                You have the right to access, correct, or request the deletion of your personal information. You can exercise these rights by contacting our Data Protection Officer.
              </p>
              <p className="text-muted-foreground">
                For more information about your rights, you can visit the website of the <a href="https://www.privacy.gov.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">National Privacy Commission (NPC)</a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:dpo@safepin.ph" className="text-primary hover:underline">dpo@safepin.ph</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;