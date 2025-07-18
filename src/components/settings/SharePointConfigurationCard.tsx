
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface SharePointConfigurationCardProps {
  sharePointEnabled: boolean;
  sharepointUrl: string;
  documentLibrary: string;
  onSharePointEnabledChange: (enabled: boolean) => void;
  onSharepointUrlChange: (url: string) => void;
  onDocumentLibraryChange: (library: string) => void;
}

const SharePointConfigurationCard: React.FC<SharePointConfigurationCardProps> = ({
  sharePointEnabled,
  sharepointUrl,
  documentLibrary,
  onSharePointEnabledChange,
  onSharepointUrlChange,
  onDocumentLibraryChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          SharePoint Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="sharePointEnabled" 
            checked={sharePointEnabled}
            onCheckedChange={onSharePointEnabledChange}
          />
          <Label htmlFor="sharePointEnabled">Enable SharePoint Integration</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sharepointUrl">SharePoint Site URL</Label>
          <Input
            id="sharepointUrl"
            placeholder="https://yourcompany.sharepoint.com/sites/sitename"
            value={sharepointUrl}
            onChange={(e) => onSharepointUrlChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="documentLibrary">Document Library</Label>
          <Input
            id="documentLibrary"
            placeholder="Shared Documents"
            value={documentLibrary}
            onChange={(e) => onDocumentLibraryChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SharePointConfigurationCard;
