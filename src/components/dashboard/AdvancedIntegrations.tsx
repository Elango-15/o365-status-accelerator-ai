import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Shield, 
  Calendar, 
  Database, 
  BarChart3, 
  FileText, 
  Settings, 
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedIntegrationsProps {
  o365Settings?: any;
}

const AdvancedIntegrations = ({ o365Settings }: AdvancedIntegrationsProps) => {
  const { toast } = useToast();
  const [integrationStates, setIntegrationStates] = useState({
    userDirectorySync: true,
    licenseTracking: true,
    teamsChannels: true,
    sharePointUsage: true,
    exchangeOnline: true,
    securityCompliance: true,
    serviceHealth: true,
    powerPlatform: false,
    meetingInsights: true,
    auditLogs: true,
    costTracking: false,
    csvImport: true,
    restApiIntegration: false,
    powerBiImport: false,
    serviceNowIntegration: false,
    jiraIntegration: false
  });

  const [importProgress, setImportProgress] = useState({
    userDirectory: 0,
    licenses: 0,
    teams: 0,
    sharePoint: 0
  });

  const isConnected = o365Settings?.isConnected || false;

  const handleToggleIntegration = (key: string) => {
    if (!isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect to O365 first to enable integrations.",
        variant: "destructive",
      });
      return;
    }

    setIntegrationStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    toast({
      title: "Integration Updated",
      description: `${key} has been ${integrationStates[key] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleImportData = (type: string) => {
    if (!isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect to O365 first.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Starting ${type} import...`);
    toast({
      title: "Import Started",
      description: `${type} data import has begun.`,
    });

    // Simulate import progress
    const progressKey = type.toLowerCase().replace(' ', '');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setImportProgress(prev => ({
        ...prev,
        [progressKey]: progress
      }));

      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: "Import Complete",
          description: `${type} data has been successfully imported.`,
        });
      }
    }, 500);
  };

  const coreIntegrations = [
    {
      id: 'userDirectorySync',
      title: 'User Directory Sync',
      description: 'Import detailed user profiles from Azure AD (departments, roles, locations)',
      icon: Users,
      enabled: integrationStates.userDirectorySync,
      importType: 'userDirectory'
    },
    {
      id: 'licenseTracking',
      title: 'License Usage & Assignment',
      description: 'Track O365 license consumption and assignments (E3, E5, Business Premium)',
      icon: Shield,
      enabled: integrationStates.licenseTracking,
      importType: 'licenses'
    },
    {
      id: 'teamsChannels',
      title: 'Teams & Channels',
      description: 'Import MS Teams structure, active teams, channels, and activity metrics',
      icon: Users,
      enabled: integrationStates.teamsChannels,
      importType: 'teams'
    },
    {
      id: 'sharePointUsage',
      title: 'SharePoint / OneDrive Usage',
      description: 'Import storage consumption, active sites, and document activity trends',
      icon: Database,
      enabled: integrationStates.sharePointUsage,
      importType: 'sharePoint'
    }
  ];

  const additionalIntegrations = [
    {
      id: 'exchangeOnline',
      title: 'Exchange Online',
      description: 'Mailbox sizes, active/inactive mailboxes, quota usage',
      icon: FileText,
      enabled: integrationStates.exchangeOnline
    },
    {
      id: 'securityCompliance',
      title: 'Security & Compliance',
      description: 'Microsoft Secure Score, Defender alerts, Compliance Center data',
      icon: Shield,
      enabled: integrationStates.securityCompliance
    },
    {
      id: 'serviceHealth',
      title: 'Service Health & Incidents',
      description: 'O365 service health status and incident reports',
      icon: Activity,
      enabled: integrationStates.serviceHealth
    },
    {
      id: 'powerPlatform',
      title: 'Power Platform',
      description: 'PowerApps and Power Automate usage insights',
      icon: Settings,
      enabled: integrationStates.powerPlatform
    },
    {
      id: 'meetingInsights',
      title: 'Meeting & Calendar Insights',
      description: 'Meeting frequency, duration, and calendar analytics',
      icon: Calendar,
      enabled: integrationStates.meetingInsights
    },
    {
      id: 'auditLogs',
      title: 'Audit & Activity Logs',
      description: 'User actions, logins, file sharing, admin changes',
      icon: FileText,
      enabled: integrationStates.auditLogs
    }
  ];

  const externalIntegrations = [
    {
      id: 'costTracking',
      title: 'Cost Tracking',
      description: 'License and subscription cost visualization',
      icon: DollarSign,
      enabled: integrationStates.costTracking
    },
    {
      id: 'csvImport',
      title: 'CSV Import',
      description: 'Import data from external sources and non-O365 systems',
      icon: Upload,
      enabled: integrationStates.csvImport
    },
    {
      id: 'restApiIntegration',
      title: 'REST API Integration',
      description: 'Connect custom tools or ERP systems',
      icon: Settings,
      enabled: integrationStates.restApiIntegration
    },
    {
      id: 'powerBiImport',
      title: 'Power BI Import',
      description: 'Import existing Power BI reports and dashboards',
      icon: BarChart3,
      enabled: integrationStates.powerBiImport
    },
    {
      id: 'serviceNowIntegration',
      title: 'ServiceNow Integration',
      description: 'Import ticket data for productivity insights',
      icon: AlertTriangle,
      enabled: integrationStates.serviceNowIntegration
    },
    {
      id: 'jiraIntegration',
      title: 'Jira Integration',
      description: 'Project management and issue tracking integration',
      icon: CheckCircle,
      enabled: integrationStates.jiraIntegration
    }
  ];

  return (
    <div className="space-y-6">
      {/* Core O365 Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Core O365 Data Imports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {coreIntegrations.map((integration) => {
            const IconComponent = integration.icon;
            const progress = importProgress[integration.importType] || 0;
            
            return (
              <div key={integration.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">{integration.title}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => handleToggleIntegration(integration.id)}
                      disabled={!isConnected}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleImportData(integration.title)}
                      disabled={!isConnected || !integration.enabled}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                  </div>
                </div>
                {progress > 0 && progress < 100 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Importing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
                {progress === 100 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Import completed successfully
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional O365 Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Additional O365 Services
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalIntegrations.map((integration) => {
            const IconComponent = integration.icon;
            
            return (
              <div key={integration.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{integration.title}</h4>
                    <p className="text-xs text-gray-600">{integration.description}</p>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                    disabled={!isConnected}
                  />
                </div>
                {integration.enabled && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* External Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            External Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalIntegrations.map((integration) => {
            const IconComponent = integration.icon;
            
            return (
              <div key={integration.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{integration.title}</h4>
                    <p className="text-xs text-gray-600">{integration.description}</p>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                  />
                </div>
                {integration.enabled && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Import Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Integration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(integrationStates).filter(Boolean).length}
              </div>
              <div className="text-sm text-blue-600">Active Integrations</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {coreIntegrations.filter(i => integrationStates[i.id]).length}
              </div>
              <div className="text-sm text-green-600">Core O365 Services</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {additionalIntegrations.filter(i => integrationStates[i.id]).length}
              </div>
              <div className="text-sm text-purple-600">Additional Services</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {externalIntegrations.filter(i => integrationStates[i.id]).length}
              </div>
              <div className="text-sm text-orange-600">External Tools</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedIntegrations;
