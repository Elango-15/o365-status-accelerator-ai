
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ExternalLink, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateUrl, sanitizeInput } from '@/utils/securityUtils';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';

interface O365AdminPortalCardProps {
  tenantId: string;
  clientId: string;
  adminPortalUrl: string;
  isConnected: boolean;
  onTenantIdChange: (value: string) => void;
  onClientIdChange: (value: string) => void;
  onAdminPortalUrlChange: (value: string) => void;
  onConnect: () => void;
  onTestConnection: () => void;
}

const O365AdminPortalCard: React.FC<O365AdminPortalCardProps> = ({
  tenantId,
  clientId,
  adminPortalUrl,
  isConnected,
  onTenantIdChange,
  onClientIdChange,
  onAdminPortalUrlChange,
  onConnect,
  onTestConnection
}) => {
  const { toast } = useToast();
  const canModifySettings = AuthService.hasPermission(PERMISSIONS.ADMIN_SETTINGS);
  const [showTenantId, setShowTenantId] = React.useState(false);
  const [showClientId, setShowClientId] = React.useState(false);

  const openAdminPortal = () => {
    const url = sanitizeInput(adminPortalUrl) || 'https://admin.microsoft.com';
    if (validateUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log('Opening Admin Portal:', url);
    } else {
      toast({
        title: "Invalid URL",
        description: "Admin Portal URL is not valid.",
        variant: "destructive",
      });
    }
  };

  const maskId = (id: string) => {
    if (!id) return '';
    return id.substring(0, 8) + '-****-****-****-************';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          O365 Admin Portal Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Connection Status</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant ID *</Label>
            <div className="relative">
              <Input
                id="tenantId"
                type={showTenantId ? "text" : "password"}
                placeholder="Enter your Azure AD Tenant ID"
                value={showTenantId ? tenantId : maskId(tenantId)}
                onChange={(e) => onTenantIdChange(sanitizeInput(e.target.value))}
                disabled={!canModifySettings}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowTenantId(!showTenantId)}
              >
                {showTenantId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Application (Client) ID *</Label>
            <div className="relative">
              <Input
                id="clientId"
                type={showClientId ? "text" : "password"}
                placeholder="Enter your App Registration Client ID"
                value={showClientId ? clientId : maskId(clientId)}
                onChange={(e) => onClientIdChange(sanitizeInput(e.target.value))}
                disabled={!canModifySettings}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowClientId(!showClientId)}
              >
                {showClientId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminPortalUrl">Admin Portal URL</Label>
            <Input
              id="adminPortalUrl"
              placeholder="https://admin.microsoft.com"
              value={adminPortalUrl}
              onChange={(e) => onAdminPortalUrlChange(sanitizeInput(e.target.value))}
              disabled={!canModifySettings}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onConnect} 
              disabled={!tenantId || !clientId || !canModifySettings}
            >
              <Key className="h-4 w-4 mr-2" />
              Connect to O365
            </Button>
            <Button 
              variant="outline" 
              onClick={onTestConnection} 
              disabled={!tenantId || !clientId}
            >
              Test Connection
            </Button>
            <Button variant="outline" onClick={openAdminPortal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Portal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default O365AdminPortalCard;
