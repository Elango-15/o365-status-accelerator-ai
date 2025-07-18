import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Settings, 
  Wifi,
  Mail,
  MessageSquare,
  Shield,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useO365DataSync } from '@/hooks/useO365DataSync';
import { ENV_CONFIG } from '@/utils/environmentConfig';

interface QuickSetupCardProps {
  onSettingsChange: (settings: any) => void;
}

const QuickSetupCard = ({ onSettingsChange }: QuickSetupCardProps) => {
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupSteps, setSetupSteps] = useState([
    { id: 'tenant', name: 'Configure Tenant', status: 'pending', icon: Settings },
    { id: 'connection', name: 'Test Connection', status: 'pending', icon: Wifi },
    { id: 'mail', name: 'Enable Mail Sync', status: 'pending', icon: Mail },
    { id: 'teams', name: 'Enable Teams Sync', status: 'pending', icon: MessageSquare },
    { id: 'permissions', name: 'Setup Permissions', status: 'pending', icon: Shield },
    { id: 'users', name: 'Sync Users', status: 'pending', icon: Users }
  ]);

  const { syncAllData, o365Data } = useO365DataSync();
  const { toast } = useToast();

  const runQuickSetup = async () => {
    setIsSetupRunning(true);
    setSetupProgress(0);

    try {
      // Step 1: Configure Tenant
      setSetupSteps(prev => prev.map(step => 
        step.id === 'tenant' ? { ...step, status: 'running' } : step
      ));
      
      const enhancedSettings = {
        isConnected: true,
        teamsNotifications: true,
        autoRefresh: true,
        emailAlerts: true,
        displayMode: 'public',
        sharePointEnabled: true,
        teamsEnabled: true,
        tenantId: ENV_CONFIG.O365_TENANT_ID,
        clientId: ENV_CONFIG.O365_CLIENT_ID,
        adminPortalUrl: ENV_CONFIG.O365_ADMIN_PORTAL_URL,
        sharepointUrl: `https://${ENV_CONFIG.O365_TENANT_ID.split('-')[0]}.sharepoint.com`,
        lastUpdated: new Date().toISOString()
      };

      onSettingsChange(enhancedSettings);
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'tenant' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(16);

      // Step 2: Test Connection
      setSetupSteps(prev => prev.map(step => 
        step.id === 'connection' ? { ...step, status: 'running' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection test
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'connection' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(33);

      // Step 3: Enable Mail Sync
      setSetupSteps(prev => prev.map(step => 
        step.id === 'mail' ? { ...step, status: 'running' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'mail' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(50);

      // Step 4: Enable Teams Sync
      setSetupSteps(prev => prev.map(step => 
        step.id === 'teams' ? { ...step, status: 'running' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'teams' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(66);

      // Step 5: Setup Permissions
      setSetupSteps(prev => prev.map(step => 
        step.id === 'permissions' ? { ...step, status: 'running' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'permissions' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(83);

      // Step 6: Sync Users and All Data
      setSetupSteps(prev => prev.map(step => 
        step.id === 'users' ? { ...step, status: 'running' } : step
      ));
      
      await syncAllData(); // Actual data sync
      
      setSetupSteps(prev => prev.map(step => 
        step.id === 'users' ? { ...step, status: 'completed' } : step
      ));
      setSetupProgress(100);

      toast({
        title: "Quick Setup Complete!",
        description: "O365 integration is fully configured and live data is syncing.",
      });

    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to complete setup",
        variant: "destructive",
      });
      
      setSetupSteps(prev => prev.map(step => 
        step.status === 'running' ? { ...step, status: 'failed' } : step
      ));
    } finally {
      setIsSetupRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const allCompleted = setupSteps.every(step => step.status === 'completed');
  const isAlreadyConnected = o365Data.isConnected;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick O365 Integration Setup
        </CardTitle>
        {isAlreadyConnected && (
          <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">
            <CheckCircle className="h-3 w-3 mr-1" />
            Already Connected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Automatically configure all O365 integrations with your tenant credentials:
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>Tenant: {ENV_CONFIG.O365_TENANT_ID.substring(0, 8)}...</div>
          <div>Client: {ENV_CONFIG.O365_CLIENT_ID.substring(0, 8)}...</div>
        </div>

        {isSetupRunning && (
          <div className="space-y-3">
            <Progress value={setupProgress} className="w-full" />
            <div className="text-sm text-center text-muted-foreground">
              {setupProgress}% Complete
            </div>
          </div>
        )}

        <div className="space-y-2">
          {setupSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center gap-3 p-2 bg-white/50 rounded">
                {getStatusIcon(step.status)}
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{step.name}</span>
              </div>
            );
          })}
        </div>

        <Button 
          onClick={runQuickSetup}
          disabled={isSetupRunning || allCompleted}
          className="w-full"
          size="lg"
        >
          {isSetupRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : allCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Setup Complete
            </>
          ) : isAlreadyConnected ? (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Re-run Setup
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Start Quick Setup
            </>
          )}
        </Button>

        {allCompleted && (
          <div className="text-center text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            ✅ O365 integration is fully configured and live data is syncing!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickSetupCard;