
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { validateEnvironment } from '@/utils/environmentConfig';
import { AuthService } from '@/utils/authUtils';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardNavigation from './dashboard/DashboardNavigation';
import DashboardContent from './dashboard/DashboardContent';
import O365IntegrationSetup from './O365IntegrationSetup';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useO365Settings } from '@/hooks/useO365Settings';
import { useFileOperations } from '@/hooks/useFileOperations';
import { useO365DataSync } from '@/hooks/useO365DataSync';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use custom hooks for data management
  const { dashboardData, setDashboardData } = useDashboardData();
  const { o365Settings, handleSettingsChange } = useO365Settings();
  const { companyLogo, handleLogoUpload, handleExport, handleImport } = useFileOperations(
    dashboardData,
    setDashboardData,
    o365Settings,
    () => {} // setO365Settings not needed in file operations
  );
  
  // O365 real-time data integration
  const { o365Data, syncStatus } = useO365DataSync();

  // Initialize authentication and validate environment on mount
  useEffect(() => {
    const initialize = async () => {
      // Initialize authentication service
      await AuthService.initialize();
      
      // Start session monitoring
      AuthService.startSessionMonitoring();
      
      // Validate environment
      const envValidation = validateEnvironment();
      if (!envValidation.valid && process.env.NODE_ENV === 'development') {
        console.warn('Missing environment variables:', envValidation.missing);
      }
      
      if (envValidation.warnings.length > 0) {
        console.info('Environment warnings:', envValidation.warnings);
      }
    };

    initialize();
  }, []);

  // Show O365 setup if not properly configured
  const showO365Setup = !o365Data.isConnected && activeTab === 'o365-setup';

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          companyLogo={companyLogo}
          o365Settings={o365Settings}
          onLogoUpload={handleLogoUpload}
          onImport={handleImport}
          onExport={handleExport}
          onSettingsChange={handleSettingsChange}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <DashboardNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          {showO365Setup ? (
            <O365IntegrationSetup />
          ) : (
            <DashboardContent 
              dashboardData={dashboardData}
              companyLogo={companyLogo}
              o365Settings={o365Settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
