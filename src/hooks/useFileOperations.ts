
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecureStorage, DashboardDataSchema, O365SettingsSchema, validateFile } from '@/utils/securityUtils';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export const useFileOperations = (dashboardData: any, setDashboardData: (data: any) => void, o365Settings: any, setO365Settings: (settings: any) => void) => {
  const [companyLogo, setCompanyLogo] = useState<string | null>('/CD-uploads/436f3120-897c-4d0d-88ef-2e411c49828a.png');
  const { toast } = useToast();

  // Load logo securely
  useEffect(() => {
    const savedLogo = SecureStorage.getSecureItem('companyLogo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = () => {
    if (!AuthService.hasPermission(PERMISSIONS.WRITE_DASHBOARD)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to upload files.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ENV_CONFIG.ALLOWED_FILE_TYPES.filter(type => type.startsWith('image/')).join(',');
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const validation = validateFile(file, ENV_CONFIG.ALLOWED_FILE_TYPES.filter(type => type.startsWith('image/')), ENV_CONFIG.MAX_FILE_SIZE);
        
        if (!validation.valid) {
          toast({
            title: "Invalid File",
            description: validation.error,
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const logoData = e.target?.result as string;
          setCompanyLogo(logoData);
          
          SecureStorage.setSecureItem('companyLogo', logoData);
          
          toast({
            title: "Logo Updated",
            description: "Company logo has been updated successfully.",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleExport = () => {
    if (!AuthService.hasPermission(PERMISSIONS.EXPORT_DATA)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to export data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const exportData = {
        ...dashboardData,
        companyLogo,
        o365Settings: {
          ...o365Settings,
          // Remove sensitive data from export
          tenantId: undefined,
          clientId: undefined,
          teamsWebhook: undefined
        },
        exportDate: new Date().toISOString(),
        activeTab: 'overview',
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export dashboard data.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (!AuthService.hasPermission(PERMISSIONS.IMPORT_DATA)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to import data.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const validation = validateFile(file, ['application/json'], 10 * 1024 * 1024); // 10MB limit for JSON
        
        if (!validation.valid) {
          toast({
            title: "Invalid File",
            description: validation.error,
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            
            // Validate imported data structure
            const dashboardValidation = DashboardDataSchema.safeParse({
              productivityData: importedData.productivityData,
              statusData: importedData.statusData,
              teamMetrics: importedData.teamMetrics
            });
            
            if (!dashboardValidation.success) {
              throw new Error('Invalid dashboard data format');
            }
            
            // Ensure all required properties are present with proper defaults
            const updatedDashboardData = {
              productivityData: (dashboardValidation.data.productivityData || dashboardData.productivityData).map(item => ({
                name: item.name || '',
                tasks: item.tasks || 0,
                completed: item.completed || 0
              })),
              statusData: (dashboardValidation.data.statusData || dashboardData.statusData).map(item => ({
                name: item.name || '',
                value: item.value || 0,
                color: item.color || '#000000'
              })),
              teamMetrics: (dashboardValidation.data.teamMetrics || dashboardData.teamMetrics).map((metric, index) => ({
                metric: metric.metric || dashboardData.teamMetrics[index]?.metric || '',
                value: metric.value || dashboardData.teamMetrics[index]?.value || '0',
                change: metric.change || dashboardData.teamMetrics[index]?.change || '0%',
                trend: metric.trend || dashboardData.teamMetrics[index]?.trend || 'up',
                icon: dashboardData.teamMetrics[index]?.icon || dashboardData.teamMetrics[0].icon
              }))
            };
            
            setDashboardData(updatedDashboardData);
            
            if (importedData.companyLogo) {
              setCompanyLogo(importedData.companyLogo);
              SecureStorage.setSecureItem('companyLogo', importedData.companyLogo);
            }

            // Don't import sensitive O365 settings
            if (importedData.o365Settings) {
              const safeSettings = {
                ...importedData.o365Settings,
                tenantId: o365Settings.tenantId, // Keep existing
                clientId: o365Settings.clientId, // Keep existing
                teamsWebhook: o365Settings.teamsWebhook // Keep existing
              };
              
              const settingsValidation = O365SettingsSchema.safeParse(safeSettings);
              if (settingsValidation.success) {
                setO365Settings(settingsValidation.data);
                SecureStorage.setSecureItem('o365DashboardSettings', JSON.stringify(settingsValidation.data));
              }
            }
            
            toast({
              title: "Import Successful",
              description: "Dashboard data has been imported and updated successfully.",
            });
          } catch (error) {
            console.error('Import error:', error);
            toast({
              title: "Import Failed",
              description: "Failed to parse the imported file. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  return {
    companyLogo,
    handleLogoUpload,
    handleExport,
    handleImport
  };
};
