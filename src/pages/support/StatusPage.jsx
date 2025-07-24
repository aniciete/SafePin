import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

const StatusIndicator = ({ status, label, description, lastUpdated }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          badge: 'bg-green-500'
        };
      case 'degraded':
        return {
          icon: AlertCircleIcon,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          badge: 'bg-yellow-500'
        };
      case 'outage':
        return {
          icon: XCircleIcon,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          badge: 'bg-red-500'
        };
      case 'maintenance':
        return {
          icon: ClockIcon,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          badge: 'bg-blue-500'
        };
      default:
        return {
          icon: CheckCircleIcon,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          badge: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${config.bgColor}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge className={`${config.badge} text-white`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Updated {lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
};

  // Helper function to format dates in Philippine Standard Time
  const formatPSTTime = (date) => {
    return new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const StatusPage = () => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    services: [
      {
        id: 'web-app',
        name: 'Web Application',
        description: 'Main SafePin website and reporting interface hosted on Philippine data centres',
        status: 'operational',
        lastUpdated: '2 minutes ago'
      },
      {
        id: 'api',
        name: 'API Services',
        description: 'Backend services for incident report processing via PLDT and Globe networks',
        status: 'operational',
        lastUpdated: '5 minutes ago'
      },
      {
        id: 'database',
        name: 'Database Systems',
        description: 'Secure data storage in Philippine-compliant data centres (Makati, BGC)',
        status: 'operational',
        lastUpdated: '1 minute ago'
      },
      {
        id: 'notifications',
        name: 'SMS & Email Alerts',
        description: 'Notification services via Smart, Globe, and DITO telecommunications',
        status: 'operational',
        lastUpdated: '3 minutes ago'
      },
      {
        id: 'file-upload',
        name: 'Evidence Upload',
        description: 'Secure file upload for incident evidence and documentation',
        status: 'operational',
        lastUpdated: '4 minutes ago'
      },
      {
        id: 'maps',
        name: 'Location Services',
        description: 'Philippine mapping and GPS services for accurate incident location',
        status: 'operational',
        lastUpdated: '6 minutes ago'
      },
      {
        id: 'emergency-integration',
        name: 'Emergency Services Integration',
        description: 'Connection to PNP, BFP, and emergency response systems',
        status: 'operational',
        lastUpdated: '8 minutes ago'
      }
    ],
    incidents: [
      {
        id: 1,
        title: 'Scheduled Maintenance - BGC Data Centre Upgrade',
        status: 'resolved',
        severity: 'low',
        startTime: '2025-01-23T18:00:00+08:00', // 6:00 PM PST
        endTime: '2025-01-23T20:30:00+08:00',   // 8:30 PM PST
        description: 'Routine infrastructure upgrade at our Bonifacio Global City data centre to improve service reliability during peak hours. Minimal impact expected for Metro Manila users.',
        updates: [
          {
            time: '2025-01-23T20:30:00+08:00',
            message: 'Maintenance completed successfully. All systems operational. Response times improved by 15% for NCR users.'
          },
          {
            time: '2025-01-23T18:00:00+08:00',
            message: 'Maintenance started at BGC facility. Monitoring network performance across PLDT and Globe connections.'
          }
        ]
      },
      {
        id: 2,
        title: 'Network Optimisation - Mindanao Region',
        status: 'resolved',
        severity: 'medium',
        startTime: '2025-01-22T14:00:00+08:00',
        endTime: '2025-01-22T16:45:00+08:00',
        description: 'Improved connectivity for users in Davao, Cagayan de Oro, and surrounding areas through DITO network integration.',
        updates: [
          {
            time: '2025-01-22T16:45:00+08:00',
            message: 'Network optimisation complete. Users in Mindanao should experience faster report submission times.'
          },
          {
            time: '2025-01-22T15:30:00+08:00',
            message: 'DITO network integration progressing well. Testing emergency service connections.'
          },
          {
            time: '2025-01-22T14:00:00+08:00',
            message: 'Starting network optimisation for improved coverage in Mindanao region.'
          }
        ]
      }
    ]
  });

  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Simulate periodic status updates
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In a real app, this would fetch actual status data
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getOverallStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          text: 'All Systems Operational',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'degraded':
        return {
          text: 'Degraded Performance',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'outage':
        return {
          text: 'Service Outage',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          text: 'Status Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const overallConfig = getOverallStatusConfig(systemStatus.overall);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">System Status</h1>
        <p className="text-center text-muted-foreground mb-4">
          Current status of SafePin services across the Philippines
        </p>
        <p className="text-center text-sm text-muted-foreground mb-12">
          All times displayed in Philippine Standard Time (PST, UTC+8)
        </p>

        {/* Overall Status */}
        <Card className={`mb-8 ${overallConfig.bgColor} ${overallConfig.borderColor}`}>
          <CardContent className="text-center py-8">
            <h2 className={`text-2xl font-bold ${overallConfig.color}`}>
              {overallConfig.text}
            </h2>
            <p className="text-muted-foreground mt-2">
              Last updated: {formatPSTTime(lastRefresh)} PST
            </p>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.services.map((service) => (
                <StatusIndicator
                  key={service.id}
                  status={service.status}
                  label={service.name}
                  description={service.description}
                  lastUpdated={service.lastUpdated}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {systemStatus.incidents.length > 0 ? (
              <div className="space-y-6">
                {systemStatus.incidents.map((incident) => (
                  <div key={incident.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <Badge variant={incident.status === 'resolved' ? 'default' : 'destructive'}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {incident.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      {formatPSTTime(new Date(incident.startTime))} PST - {' '}
                      {incident.endTime ? `${formatPSTTime(new Date(incident.endTime))} PST` : 'Ongoing'}
                    </div>
                    <div className="space-y-2">
                      {incident.updates.map((update, index) => (
                        <div key={index} className="text-sm">
                          <span className="text-muted-foreground">
                            {formatPSTTime(new Date(update.time))} PST:
                          </span>
                          <span className="ml-2">{update.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent incidents to report. All systems are running smoothly across the Philippines.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Infrastructure Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Philippine Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Data Centres</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Primary: Bonifacio Global City, Taguig</li>
                  <li>• Secondary: Makati Central Business District</li>
                  <li>• Backup: Cebu IT Park, Cebu City</li>
                  <li>• All facilities comply with BSP and NPC regulations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Network Partners</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• PLDT (Primary backbone connectivity)</li>
                  <li>• Globe Telecom (Secondary network)</li>
                  <li>• DITO Telecommunity (Emerging coverage)</li>
                  <li>• Smart Communications (SMS services)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Emergency Integration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Philippine National Police (PNP) - 117</li>
                  <li>• Bureau of Fire Protection (BFP) - 116</li>
                  <li>• National Emergency Hotline - 911</li>
                  <li>• Citizen's Complaint Hotline - 8888</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Regional Coverage</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Luzon: Full coverage via Metro Manila hub</li>
                  <li>• Visayas: Optimised through Cebu facility</li>
                  <li>• Mindanao: Enhanced via DITO partnership</li>
                  <li>• Island provinces: Satellite connectivity backup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>Status Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">Operational</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Service is functioning normally across all Philippine regions with optimal response times.
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">Degraded Performance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Service is operational but may experience slower response times due to network conditions or high traffic.
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                  <span className="font-semibold">Service Outage</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Service is currently unavailable. Emergency reports can still be made via SMS to 2920 or call 911.
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ClockIcon className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">Scheduled Maintenance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Service is undergoing planned maintenance to improve reliability. Typically scheduled during low-traffic hours (2:00-5:00 AM PST).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Emergency Reporting Alternatives</h3>
          <p className="text-sm text-blue-700">
            If SafePin services are unavailable, you can still report emergencies directly to:
          </p>
          <div className="mt-2 text-sm text-blue-700">
            <span className="font-medium">Emergency Hotline:</span> 911 | 
            <span className="font-medium ml-2">PNP:</span> 117 | 
            <span className="font-medium ml-2">BFP:</span> 116 | 
            <span className="font-medium ml-2">SMS Hotline:</span> 2920
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;