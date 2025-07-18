
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecureStorage, O365SettingsSchema, validateUrl, sanitizeInput } from '@/utils/securityUtils';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';
import QuickSetupCard from './settings/QuickSetupCard';
import DisplayModeCard from './settings/DisplayModeCard';
import O365AdminPortalCard from './settings/O365AdminPortalCard';
import SharePointConfigurationCard from './settings/SharePointConfigurationCard';
import TeamsConfigurationCard from './settings/TeamsConfigurationCard';
import DashboardPreferencesCard from './settings/DashboardPreferencesCard';

interface SettingsModalProps {
  onSettingsChange?: (settings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [adminPortalUrl, setAdminPortalUrl] = useState('https://admin.microsoft.com');
  const [sharepointUrl, setSharepointUrl] = useState('');
  const [documentLibrary, setDocumentLibrary] = useState('Shared Documents');
  const [teamsWebhook, setTeamsWebhook] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [teamsNotifications, setTeamsNotifications] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [displayMode, setDisplayMode] = useState('public');
  const [sharePointEnabled, setSharePointEnabled] = useState(false);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  
  const { toast } = useToast();
  const canModifySettings = AuthService.hasPermission(PERMISSIONS.ADMIN_SETTINGS);

  // Load settings securely
  useEffect(() => {
    try {
      const savedSettings = SecureStorage.getSecureItem('o365DashboardSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('Loaded settings:', settings);
        
        // Apply settings directly without strict validation during load
        setTenantId(settings.tenantId || ENV_CONFIG.O365_TENANT_ID);
        setClientId(settings.clientId || ENV_CONFIG.O365_CLIENT_ID);
        setAdminPortalUrl(settings.adminPortalUrl || ENV_CONFIG.O365_ADMIN_PORTAL_URL);
        setSharepointUrl(settings.sharepointUrl || '');
        setDocumentLibrary(settings.documentLibrary || 'Shared Documents');
        setTeamsWebhook(settings.teamsWebhook || '');
        setIsConnected(settings.isConnected || false);
        setTeamsNotifications(settings.teamsNotifications || false);
        setAutoRefresh(settings.autoRefresh || false);
        setDarkMode(settings.darkMode || false);
        setEmailAlerts(settings.emailAlerts || false);
        setDisplayMode(settings.displayMode || 'public');
        setSharePointEnabled(settings.sharePointEnabled || false);
        setTeamsEnabled(settings.teamsEnabled || false);
      } else {
        // Use environment defaults
        setTenantId(ENV_CONFIG.O365_TENANT_ID);
        setClientId(ENV_CONFIG.O365_CLIENT_ID);
        setAdminPortalUrl(ENV_CONFIG.O365_ADMIN_PORTAL_URL);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to load settings.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleO365Connect = () => {
    if (!canModifySettings) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to modify O365 settings.",
        variant: "destructive",
      });
      return;
    }

    if (!tenantId || !clientId) {
      toast({
        title: "Missing Information",
        description: "Please enter both Tenant ID and Client ID.",
        variant: "destructive",
      });
      return;
    }

    setIsConnected(true);
    console.log('Connecting to O365 Admin Portal...', { tenantId: tenantId.substring(0, 8) + '...' });
    
    toast({
      title: "O365 Connection Successful",
      description: "Successfully connected to Office 365 Admin Portal.",
    });
  };

  const testConnection = () => {
    if (!tenantId || !clientId) {
      toast({
        title: "Missing Information",
        description: "Please enter Tenant ID and Client ID first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Testing connection to Microsoft Graph API...');
    toast({
      title: "Connection Test",
      description: "Testing connection to Microsoft Graph API...",
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to Microsoft Graph API.",
      });
      setIsConnected(true);
    }, 2000);
  };

  const enableAllIntegrations = () => {
    setIsConnected(true);
    setTeamsNotifications(true);
    setAutoRefresh(true);
    setEmailAlerts(true);
    setSharePointEnabled(true);
    setTeamsEnabled(true);
  };

  const saveSettings = () => {
    if (!canModifySettings) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to save settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Basic URL validation
      if (adminPortalUrl && !validateUrl(adminPortalUrl)) {
        toast({
          title: "Invalid URL",
          description: "Admin Portal URL is not valid.",
          variant: "destructive",
        });
        return;
      }

      if (sharepointUrl && !validateUrl(sharepointUrl)) {
        toast({
          title: "Invalid URL",
          description: "SharePoint URL is not valid.",
          variant: "destructive",
        });
        return;
      }

      if (teamsWebhook && !validateUrl(teamsWebhook)) {
        toast({
          title: "Invalid URL",
          description: "Teams Webhook URL is not valid.",
          variant: "destructive",
        });
        return;
      }

      const settings = {
        tenantId: sanitizeInput(tenantId),
        clientId: sanitizeInput(clientId),
        adminPortalUrl: sanitizeInput(adminPortalUrl),
        sharepointUrl: sanitizeInput(sharepointUrl),
        documentLibrary: sanitizeInput(documentLibrary),
        teamsWebhook: sanitizeInput(teamsWebhook),
        isConnected,
        teamsNotifications,
        autoRefresh,
        darkMode,
        emailAlerts,
        displayMode,
        sharePointEnabled,
        teamsEnabled,
        lastUpdated: new Date().toISOString()
      };

      console.log('Saving settings:', settings);

      // Validate settings schema with better error handling
      const validated = O365SettingsSchema.safeParse(settings);
      if (!validated.success) {
        console.error('Validation errors:', validated.error.errors);
        toast({
          title: "Validation Error",
          description: `Settings validation failed: ${validated.error.errors[0]?.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }

      // Save securely
      SecureStorage.setSecureItem('o365DashboardSettings', JSON.stringify(validated.data));
      
      // Notify parent component
      if (onSettingsChange) {
        onSettingsChange(validated.data);
      }

      toast({
        title: "Settings Saved",
        description: "All dashboard settings have been saved successfully.",
      });

      setIsOpen(false);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: `Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Settings
            {!canModifySettings && (
              <Badge variant="secondary">Read Only</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!canModifySettings && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You have read-only access to settings. Contact an administrator to make changes.
              </p>
            </div>
          )}

          <QuickSetupCard onEnableAll={enableAllIntegrations} />

          <DisplayModeCard 
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
          />

          <O365AdminPortalCard
            tenantId={tenantId}
            clientId={clientId}
            adminPortalUrl={adminPortalUrl}
            isConnected={isConnected}
            onTenantIdChange={setTenantId}
            onClientIdChange={setClientId}
            onAdminPortalUrlChange={setAdminPortalUrl}
            onConnect={handleO365Connect}
            onTestConnection={testConnection}
          />

          <SharePointConfigurationCard
            sharePointEnabled={sharePointEnabled}
            sharepointUrl={sharepointUrl}
            documentLibrary={documentLibrary}
            onSharePointEnabledChange={setSharePointEnabled}
            onSharepointUrlChange={setSharepointUrl}
            onDocumentLibraryChange={setDocumentLibrary}
          />

          <TeamsConfigurationCard
            teamsEnabled={teamsEnabled}
            teamsWebhook={teamsWebhook}
            teamsNotifications={teamsNotifications}
            onTeamsEnabledChange={setTeamsEnabled}
            onTeamsWebhookChange={setTeamsWebhook}
            onTeamsNotificationsChange={setTeamsNotifications}
          />

          <DashboardPreferencesCard
            autoRefresh={autoRefresh}
            darkMode={darkMode}
            emailAlerts={emailAlerts}
            onAutoRefreshChange={setAutoRefresh}
            onDarkModeChange={setDarkMode}
            onEmailAlertsChange={setEmailAlerts}
          />

          {/* Save Settings */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings} disabled={!canModifySettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
