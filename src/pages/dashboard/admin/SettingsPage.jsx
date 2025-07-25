import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeProvider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getJurisdictionNameByCode } from '../../../utils/jurisdictionUtils';
import { formatLabel } from '../../../utils/formatUtils';
import ChangePasswordForm from '../../../components/auth/ChangePasswordForm';

const SettingsPage = () => {
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!profile) {
    return <div>Loading profile...</div>; // Or a skeleton loader
  }

  return (
    <div className="space-y-6">
      <div>
       <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and interface preferences.</p>
      </div>

      {/* --- Profile Information Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details. Email cannot be changed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} readOnly disabled />
          </div>
          <div className="space-y-1">
            <Label>Role</Label>
            <div>
              <Badge variant="secondary">{formatLabel(profile.role)}</Badge>
            </div>
          </div>
          {profile.role === 'authority' && (
            <div className="space-y-1">
              <Label>Jurisdiction</Label>
              <p className="text-sm font-medium">{getJurisdictionNameByCode(profile.jurisdiction)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- NEW SECURITY CARD --- */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* --- Theme Settings Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Settings</CardTitle>
          <CardDescription>Choose how you want SafePin to look.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Theme</Label>
          <div className="flex items-center space-x-2">
            <Button 
              variant={theme === 'light' ? 'secondary' : 'outline'} 
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button 
              variant={theme === 'dark' ? 'secondary' : 'outline'} 
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button 
              variant={theme === 'system' ? 'secondary' : 'outline'} 
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;