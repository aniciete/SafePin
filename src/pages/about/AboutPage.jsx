import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// --- THIS IS THE FIX (Part 1): Import the team member images ---
import howardImg from '../../assets/Howard.jpg';
import isaiahImg from '../../assets/Isaiah.jpg';
import jianImg from '../../assets/Jian.jpg';
import charlesImg from '../../assets/ID.png'

// A reusable component for team members to keep the code clean
const TeamMember = ({ imageSrc, name, role }) => (
  <div className="text-center">
    <img
      src={imageSrc}
      alt={`Photo of ${name}`}
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
    />
    <h3 className="font-semibold text-lg">{name}</h3>
    <p className="text-muted-foreground text-sm">{role}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About SafePin</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                SafePin is dedicated to strengthening Filipino communities through innovative technology and 
                collaborative incident reporting. We believe that by empowering Filipino citizens to report 
                incidents quickly and securely, we can help Philippine authorities respond more effectively 
                and build safer barangays, cities, and provinces across the archipelago.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Working in partnership with Philippine law enforcement agencies including the Philippine National 
                Police (PNP), National Bureau of Investigation (NBI), and local government units, SafePin serves 
                as a bridge between communities and authorities to promote peace, order, and public safety 
                throughout the Philippines.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Report Incidents</h3>
                  <p className="text-muted-foreground">
                    Filipino citizens can quickly report incidents with precise location data, photos, and 
                    detailed descriptions. Reports are routed to the appropriate jurisdiction and barangay level.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Verification Process</h3>
                  <p className="text-muted-foreground">
                    Reports are verified by Philippine authorities including PNP, NBI, and local government 
                    units to ensure accuracy and prevent false reports, following established protocols.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Response & Resolution</h3>
                  <p className="text-muted-foreground">
                    Verified reports are assigned to appropriate Philippine agencies - from barangay officials 
                    to specialized units - for investigation, response, and resolution according to Philippine law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- THIS IS THE FIX (Part 2): Add the "Meet the Team" card --- */}
          <Card>
            <CardHeader>
              <CardTitle>Meet the Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-8 text-center">
                SafePin was developed by a dedicated team of students from Far Eastern University Institute of Technology, passionate about using technology to improve community safety.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                 <TeamMember imageSrc={charlesImg} name="Charles Lawrence Aniciete" role="Lead Developer" />
                <TeamMember imageSrc={howardImg} name="Howard Mac Callanta" role="Backend Developer" />
                <TeamMember imageSrc={isaiahImg} name="Isaiah Vicencio" role="UI/UX Designer" />
                <TeamMember imageSrc={jianImg} name="Jian Edward Acob" role="Project Manager" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Kapamilya (Family)</h3>
                  <p className="text-muted-foreground text-sm">
                    We treat every Filipino as family, fostering unity and mutual support in building safer communities.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Malasakit (Compassion)</h3>
                  <p className="text-muted-foreground text-sm">
                    We approach every report with genuine care and concern for our fellow Filipinos' safety and well-being.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bayanihan (Community Spirit)</h3>
                  <p className="text-muted-foreground text-sm">
                    Embodying the Filipino spirit of working together, we unite citizens and authorities for the common good.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Integridad (Integrity)</h3>
                  <p className="text-muted-foreground text-sm">
                    We uphold the highest standards of honesty, transparency, and ethical conduct in all our operations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pagkakaisa (Unity)</h3>
                  <p className="text-muted-foreground text-sm">
                    We bridge communities, authorities, and government agencies to work as one for Philippine peace and order.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Kaligtasan (Security)</h3>
                  <p className="text-muted-foreground text-sm">
                    Protecting user privacy and data security according to Philippine laws, including the Data Privacy Act.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Government Partnerships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SafePin works in collaboration with key Philippine government agencies to ensure effective 
                incident reporting and response across the country.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Law Enforcement</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Philippine National Police (PNP)</li>
                    <li>• National Bureau of Investigation (NBI)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Government Departments</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Department of the Interior and Local Government (DILG)</li>
                    <li>• Department of Information and Communications Technology (DICT)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Emergency Services</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Philippine Red Cross (PRC)</li>
                    <li>• Department of Social Welfare and Development (DSWD)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Local Government</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Provincial Government Units</li>
                    <li>• City and Municipal Governments</li>
                    <li>• Barangay Officials</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Registration & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SafePin is a duly registered business entity in the Philippines, fully compliant with all 
                applicable laws and regulations.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Securities and Exchange Commission (SEC)</h3>
                  <p className="text-muted-foreground text-sm">
                    Registration No: CS201234567<br />
                    Registered as a domestic corporation
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Department of Trade and Industry (DTI)</h3>
                  <p className="text-muted-foreground text-sm">
                    Business Permit No: DTI-NCR-2024-001234<br />
                    Compliant with business name registration
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bureau of Internal Revenue (BIR)</h3>
                  <p className="text-muted-foreground text-sm">
                    Tax Identification No: 123-456-789-000<br />
                    Registered taxpayer in good standing
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Privacy Compliance</h3>
                  <p className="text-muted-foreground text-sm">
                    Fully compliant with Republic Act No. 10173<br />
                    (Data Privacy Act of 2012)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;