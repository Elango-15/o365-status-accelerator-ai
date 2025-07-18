
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Settings,
  Users,
  Database,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ENV_CONFIG, validateEnvironment, getSetupInstructions } from '@/utils/environmentConfig';
import { AuthService } from '@/utils/authUtils';
import { useO365DataSync } from '@/hooks/useO365DataSync';

const O365IntegrationSetup = () => {
  const [tenantId, setTenantId] = useState(ENV_CONFIG.O365_TENANT_ID);
  const [clientId, setClientId] = useState(ENV_CONFIG.O365_CLIENT_ID);
  const [isConnecting, setIsConnecting] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  
  const { toast } = useToast();
  const { o365Data, syncStatus, syncAllData, getDashboardMetrics } = useO365DataSync();
  
  const envValidation = validateEnvironment();
  const setupInstructions = getSetupInstructions();
  const metrics = getDashboardMetrics();

  useEffect(() => {
    // Calculate setup progress
    let progress = 0;
    if (tenantId && tenantId !== 'ad5cd7c6-bcb2-4a2d-9106-28df885282df') progress += 25;
    if (clientId && clientId !== '00000002-0000-0000-c000-000000000000') progress += 25;
    if (AuthService.isAuthenticated()) progress += 25;
    if (o365Data.isConnected) progress += 25;
    
    setSetupProgress(progress);
  }, [tenantId, clientId, o365Data.isConnected]);

  const handleO365Login = async () => {
    setIsConnecting(true);
    
    try {
      const result = await AuthService.loginWithO365();
      
      if (result.success) {
        toast({
          title: "O365 Connected",
          description: "Successfully connected to Office 365.",
        });
        
        // Trigger initial data sync
        setTimeout(() => {
          syncAllData();
        }, 1000);
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to O365',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const openAzurePortal = () => {
    window.open('https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade', '_blank');
  };

  const openAdminPortal = () => {
    window.open(ENV_CONFIG.O365_ADMIN_PORTAL_URL, '_blank');
  };

  const getStatusColor = (isValid: boolean) => isValid ? 'text-green-600' : 'text-red-600';
  const getStatusIcon = (isValid: boolean) => isValid ? CheckCircle : AlertCircle;

  return (
    <div className="space-y-6">
      {/* Setup Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              O365 Integration Setup & Status
            </CardTitle>
            <Badge variant={setupProgress === 100 ? "default" : "secondary"}>
              {setupProgress}% Complete
            </Badge>
          </div>
          <Progress value={setupProgress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalGroups}</div>
              <div className="text-sm text-gray-600">Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.totalSites}</div>
              <div className="text-sm text-gray-600">SharePoint Sites</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="data-sync">Data Sync</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          {/* Environment Validation */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!envValidation.valid && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Missing required environment variables: {envValidation.missing.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {envValidation.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warnings: {envValidation.warnings.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Azure AD Tenant ID</Label>
                  <Input
                    id="tenantId"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="Enter your Tenant ID"
                    className={tenantId && tenantId !== 'ad5cd7c6-bcb2-4a2d-9106-28df885282df' ? 'border-green-500' : 'border-red-500'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientId">Application (Client) ID</Label>
                  <Input
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your Client ID"
                    className={clientId && clientId !== '00000002-0000-0000-c000-000000000000' ? 'border-green-500' : 'border-red-500'}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={openAzurePortal} variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Azure Portal
                </Button>
                <Button onClick={openAdminPortal} variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open M365 Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Azure Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Azure App Registration Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {setupInstructions.azureSetup.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">O365 Authentication</div>
                    <div className="text-sm text-gray-500">
                      {AuthService.isAuthenticated() ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {AuthService.isAuthenticated() ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>

              <Button 
                onClick={handleO365Login} 
                disabled={isConnecting || !tenantId || !clientId}
                className="w-full"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                {AuthService.isAuthenticated() ? 'Reconnect to O365' : 'Connect to O365'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sync Tab */}
        <TabsContent value="data-sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Synchronization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncStatus.isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Syncing O365 data...</span>
                    <span>{syncStatus.progress}%</span>
                  </div>
                  <Progress value={syncStatus.progress} />
                </div>
              )}

              {syncStatus.error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{syncStatus.error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium">{o365Data.users.length}</div>
                  <div className="text-sm text-gray-500">Users</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <Users className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="font-medium">{o365Data.groups.length}</div>
                  <div className="text-sm text-gray-500">Groups</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <Database className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="font-medium">{o365Data.sites.length}</div>
                  <div className="text-sm text-gray-500">Sites</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <Key className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <div className="font-medium">{o365Data.licenses.length}</div>
                  <div className="text-sm text-gray-500">Licenses</div>
                </div>
              </div>

              <Button 
                onClick={syncAllData}
                disabled={!AuthService.isAuthenticated() || syncStatus.isLoading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.isLoading ? 'animate-spin' : ''}`} />
                Sync All Data
              </Button>

              {o365Data.lastSync && (
                <p className="text-sm text-gray-500 text-center">
                  Last synced: {new Date(o365Data.lastSync).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Required Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Application Permissions</h4>
                <div className="space-y-2">
                  {setupInstructions.permissions.APPLICATION.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Delegated Permissions</h4>
                <div className="space-y-2">
                  {setupInstructions.permissions.DELEGATED.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default O365IntegrationSetup;
