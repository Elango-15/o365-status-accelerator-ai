
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecureStorage, O365SettingsSchema } from '@/utils/securityUtils';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export const useO365Settings = () => {
  const [o365Settings, setO365Settings] = useState<any>({
    isConnected: false,
    teamsNotifications: false,
    autoRefresh: false,
    emailAlerts: false,
    displayMode: 'public',
    sharePointEnabled: false,
    teamsEnabled: false,
    tenantId: '',
    clientId: '',
    adminPortalUrl: 'https://admin.microsoft.com',
    sharepointUrl: ''
  });
  
  const { toast } = useToast();

  // Load O365 settings securely
  useEffect(() => {
    try {
      const savedSettings = SecureStorage.getSecureItem('o365DashboardSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const validatedSettings = O365SettingsSchema.safeParse(parsedSettings);
        
        if (validatedSettings.success) {
          setO365Settings(prevSettings => ({
            ...prevSettings,
            ...validatedSettings.data
          }));
          console.log('Loaded O365 settings securely');
        } else {
          console.error('Invalid O365 settings format');
          toast({
            title: "Settings Error",
            description: "Saved settings are invalid and have been reset.",
            variant: "destructive",
          });
        }
      } else {
        // Use environment variables for default settings
        const defaultSettings = {
          isConnected: ENV_CONFIG.ENABLE_O365_INTEGRATION && !!ENV_CONFIG.O365_TENANT_ID,
          teamsNotifications: false,
          autoRefresh: false,
          emailAlerts: false,
          displayMode: 'public' as const,
          sharePointEnabled: false,
          teamsEnabled: false,
          tenantId: ENV_CONFIG.O365_TENANT_ID,
          clientId: ENV_CONFIG.O365_CLIENT_ID,
          adminPortalUrl: ENV_CONFIG.O365_ADMIN_PORTAL_URL,
          sharepointUrl: '',
          lastUpdated: new Date().toISOString()
        };
        setO365Settings(defaultSettings);
        SecureStorage.setSecureItem('o365DashboardSettings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to load dashboard settings.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Auto-refresh with security check
  useEffect(() => {
    if (o365Settings?.autoRefresh && o365Settings?.isConnected && AuthService.hasPermission(PERMISSIONS.READ_DASHBOARD)) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        toast({
          title: "Data Refreshed",
          description: "Dashboard data has been automatically updated.",
        });
      }, 15 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [o365Settings, toast]);

  const handleSettingsChange = (newSettings: any) => {
    try {
      const validatedSettings = O365SettingsSchema.safeParse(newSettings);
      
      if (!validatedSettings.success) {
        toast({
          title: "Invalid Settings",
          description: "Please check your settings and try again.",
          variant: "destructive",
        });
        return;
      }
      
      setO365Settings(validatedSettings.data);
      SecureStorage.setSecureItem('o365DashboardSettings', JSON.stringify(validatedSettings.data));
      console.log('Settings updated securely');
      
      if (validatedSettings.data.isConnected) {
        toast({
          title: "O365 Integration Active",
          description: "Dashboard is now connected to your Office 365 environment.",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  return {
    o365Settings,
    setO365Settings,
    handleSettingsChange
  };
};
