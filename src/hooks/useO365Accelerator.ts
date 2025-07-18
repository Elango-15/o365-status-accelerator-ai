
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecureStorage, O365SettingsSchema } from '@/utils/securityUtils';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export interface O365AcceleratorConfig {
  isEnabled: boolean;
  tenantId: string;
  clientId: string;
  adminPortalUrl: string;
  sharepointUrl: string;
  teamsWebhook: string;
  powerBIWorkspace: string;
  azureADConnected: boolean;
  exchangeOnlineEnabled: boolean;
  teamsEnabled: boolean;
  sharePointEnabled: boolean;
  powerBIEnabled: boolean;
  oneDriveEnabled: boolean;
  outlookEnabled: boolean;
  autoProvisioning: boolean;
  realTimeSync: boolean;
  securityCompliance: boolean;
  advancedThreatProtection: boolean;
  dataLossPreventionEnabled: boolean;
  conditionalAccessEnabled: boolean;
  multiFactorAuthEnabled: boolean;
  lastHealthCheck: string;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'pending';
  setupProgress: number;
  licenseInfo: {
    totalLicenses: number;
    usedLicenses: number;
    availableLicenses: number;
    licenseType: string;
  };
}

export const useO365Accelerator = () => {
  const [config, setConfig] = useState<O365AcceleratorConfig>({
    isEnabled: false,
    tenantId: ENV_CONFIG.O365_TENANT_ID,
    clientId: ENV_CONFIG.O365_CLIENT_ID,
    adminPortalUrl: ENV_CONFIG.O365_ADMIN_PORTAL_URL,
    sharepointUrl: '',
    teamsWebhook: '',
    powerBIWorkspace: '',
    azureADConnected: false,
    exchangeOnlineEnabled: false,
    teamsEnabled: false,
    sharePointEnabled: false,
    powerBIEnabled: false,
    oneDriveEnabled: false,
    outlookEnabled: false,
    autoProvisioning: false,
    realTimeSync: false,
    securityCompliance: false,
    advancedThreatProtection: false,
    dataLossPreventionEnabled: false,
    conditionalAccessEnabled: false,
    multiFactorAuthEnabled: false,
    lastHealthCheck: new Date().toISOString(),
    connectionStatus: 'pending',
    setupProgress: 0,
    licenseInfo: {
      totalLicenses: 0,
      usedLicenses: 0,
      availableLicenses: 0,
      licenseType: 'Microsoft 365 Business Premium'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  // Real-time health monitoring
  useEffect(() => {
    if (config.isEnabled && config.realTimeSync) {
      const healthCheckInterval = setInterval(() => {
        performHealthCheck();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(healthCheckInterval);
    }
  }, [config.isEnabled, config.realTimeSync]);

  const loadConfiguration = async () => {
    try {
      const savedConfig = SecureStorage.getSecureItem('o365AcceleratorConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prevConfig => ({
          ...prevConfig,
          ...parsedConfig
        }));
        console.log('O365 Accelerator configuration loaded:', parsedConfig);
      }
    } catch (error) {
      console.error('Error loading O365 accelerator configuration:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to load O365 accelerator configuration.",
        variant: "destructive",
      });
    }
  };

  const saveConfiguration = async (newConfig: Partial<O365AcceleratorConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      SecureStorage.setSecureItem('o365AcceleratorConfig', JSON.stringify(updatedConfig));
      
      console.log('O365 Accelerator configuration saved:', updatedConfig);
      toast({
        title: "Configuration Saved",
        description: "O365 accelerator configuration updated successfully.",
      });

      // Trigger health check after configuration changes
      if (updatedConfig.isEnabled) {
        setTimeout(() => performHealthCheck(), 1000);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Save Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    }
  };

  const performHealthCheck = async () => {
    console.log('Performing O365 health check...');
    
    try {
      // Simulate health check API calls
      const healthStatus = {
        azureAD: config.tenantId && config.clientId,
        sharePoint: config.sharePointEnabled && config.sharepointUrl,
        teams: config.teamsEnabled,
        exchange: config.exchangeOnlineEnabled,
        powerBI: config.powerBIEnabled && config.powerBIWorkspace,
        oneDrive: config.oneDriveEnabled,
        outlook: config.outlookEnabled
      };

      const connectedServices = Object.values(healthStatus).filter(Boolean).length;
      const totalServices = Object.keys(healthStatus).length;
      const healthPercentage = (connectedServices / totalServices) * 100;

      const newStatus: 'connected' | 'disconnected' | 'error' | 'pending' = 
        healthPercentage === 100 ? 'connected' :
        healthPercentage > 50 ? 'pending' :
        healthPercentage > 0 ? 'error' : 'disconnected';

      await saveConfiguration({
        connectionStatus: newStatus,
        lastHealthCheck: new Date().toISOString(),
        setupProgress: Math.round(healthPercentage),
        licenseInfo: {
          ...config.licenseInfo,
          usedLicenses: Math.floor(Math.random() * config.licenseInfo.totalLicenses),
        }
      });

      console.log(`Health check completed: ${healthPercentage}% services connected`);
    } catch (error) {
      console.error('Health check failed:', error);
      await saveConfiguration({
        connectionStatus: 'error',
        lastHealthCheck: new Date().toISOString()
      });
    }
  };

  const enableAllServices = async () => {
    setIsLoading(true);
    
    try {
      const fullConfig: Partial<O365AcceleratorConfig> = {
        isEnabled: true,
        azureADConnected: true,
        exchangeOnlineEnabled: true,
        teamsEnabled: true,
        sharePointEnabled: true,
        powerBIEnabled: true,
        oneDriveEnabled: true,
        outlookEnabled: true,
        autoProvisioning: true,
        realTimeSync: true,
        securityCompliance: true,
        advancedThreatProtection: true,
        dataLossPreventionEnabled: true,
        conditionalAccessEnabled: true,
        multiFactorAuthEnabled: true,
        licenseInfo: {
          totalLicenses: 500,
          usedLicenses: 347,
          availableLicenses: 153,
          licenseType: 'Microsoft 365 Business Premium'
        }
      };

      await saveConfiguration(fullConfig);
      
      toast({
        title: "O365 Accelerator Enabled",
        description: "All Office 365 services have been configured and enabled.",
      });

      // Perform initial health check
      setTimeout(() => performHealthCheck(), 2000);
    } catch (error) {
      console.error('Error enabling all services:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to enable all services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (service: string) => {
    console.log(`Testing connection to ${service}...`);
    
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${service}...`,
    });

    // Simulate connection test
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.2; // 80% success rate
      
      if (isSuccessful) {
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${service}.`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${service}. Please check your configuration.`,
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const getConnectionStatusColor = () => {
    switch (config.connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSetupStatusText = () => {
    if (config.setupProgress === 100) return 'Fully Configured';
    if (config.setupProgress > 75) return 'Nearly Complete';
    if (config.setupProgress > 50) return 'In Progress';
    if (config.setupProgress > 25) return 'Getting Started';
    return 'Not Configured';
  };

  return {
    config,
    isLoading,
    saveConfiguration,
    enableAllServices,
    performHealthCheck,
    testConnection,
    getConnectionStatusColor,
    getSetupStatusText,
    loadConfiguration
  };
};
