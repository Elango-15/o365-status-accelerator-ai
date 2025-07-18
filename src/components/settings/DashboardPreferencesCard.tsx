
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardPreferencesCardProps {
  autoRefresh: boolean;
  darkMode: boolean;
  emailAlerts: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  onDarkModeChange: (enabled: boolean) => void;
  onEmailAlertsChange: (enabled: boolean) => void;
}

const DashboardPreferencesCard: React.FC<DashboardPreferencesCardProps> = ({
  autoRefresh,
  darkMode,
  emailAlerts,
  onAutoRefreshChange,
  onDarkModeChange,
  onEmailAlertsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="autoRefresh" 
            checked={autoRefresh}
            onCheckedChange={onAutoRefreshChange}
          />
          <Label htmlFor="autoRefresh">Auto-refresh data every 15 minutes</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="darkMode" 
            checked={darkMode}
            onCheckedChange={onDarkModeChange}
          />
          <Label htmlFor="darkMode">Enable dark mode</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="emailAlerts" 
            checked={emailAlerts}
            onCheckedChange={onEmailAlertsChange}
          />
          <Label htmlFor="emailAlerts">Email alerts for critical updates</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPreferencesCard;
