
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamsConfigurationCardProps {
  teamsEnabled: boolean;
  teamsWebhook: string;
  teamsNotifications: boolean;
  onTeamsEnabledChange: (enabled: boolean) => void;
  onTeamsWebhookChange: (webhook: string) => void;
  onTeamsNotificationsChange: (enabled: boolean) => void;
}

const TeamsConfigurationCard: React.FC<TeamsConfigurationCardProps> = ({
  teamsEnabled,
  teamsWebhook,
  teamsNotifications,
  onTeamsEnabledChange,
  onTeamsWebhookChange,
  onTeamsNotificationsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="teamsEnabled" 
            checked={teamsEnabled}
            onCheckedChange={onTeamsEnabledChange}
          />
          <Label htmlFor="teamsEnabled">Enable Teams Integration</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teamsWebhook">Teams Webhook URL</Label>
          <Input
            id="teamsWebhook"
            placeholder="https://outlook.office.com/webhook/..."
            value={teamsWebhook}
            onChange={(e) => onTeamsWebhookChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="teamsNotifications" 
            checked={teamsNotifications}
            onCheckedChange={onTeamsNotificationsChange}
          />
          <Label htmlFor="teamsNotifications">Enable Teams Notifications</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsConfigurationCard;
