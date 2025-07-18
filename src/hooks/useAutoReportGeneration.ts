import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecureStorage } from '@/utils/securityUtils';

export interface O365Report {
  id: string;
  type: 'user-activity' | 'license-usage' | 'teams-activity' | 'sharepoint-usage' | 'security-score' | 'email-activity';
  title: string;
  data: any;
  generatedAt: string;
  status: 'generating' | 'completed' | 'error';
  tenantId: string;
  clientId: string;
}

export interface ReportMetrics {
  totalUsers: number;
  activeUsers: number;
  licensesAssigned: number;
  licensesAvailable: number;
  teamsActiveUsers: number;
  sharepointSites: number;
  emailsSent: number;
  securityScore: number;
  lastUpdated: string;
}

export const useAutoReportGeneration = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<O365Report[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastTenantConfig, setLastTenantConfig] = useState<{tenantId: string, clientId: string} | null>(null);

  // Monitor for tenant configuration changes
  useEffect(() => {
    const checkTenantConfig = () => {
      try {
        const savedSettings = SecureStorage.getSecureItem('o365DashboardSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          const currentConfig = {
            tenantId: settings.tenantId,
            clientId: settings.clientId
          };

          // Check if tenant configuration has changed and both values are present
          if (currentConfig.tenantId && currentConfig.clientId) {
            const configChanged = !lastTenantConfig || 
              lastTenantConfig.tenantId !== currentConfig.tenantId || 
              lastTenantConfig.clientId !== currentConfig.clientId;

            if (configChanged) {
              console.log('Tenant configuration detected:', {
                tenantId: currentConfig.tenantId.substring(0, 8) + '...',
                clientId: currentConfig.clientId.substring(0, 8) + '...'
              });
              
              setLastTenantConfig(currentConfig);
              generateAutomaticReports(currentConfig.tenantId, currentConfig.clientId);
            }
          }
        }
      } catch (error) {
        console.error('Error checking tenant configuration:', error);
      }
    };

    // Check immediately and then every 5 seconds
    checkTenantConfig();
    const interval = setInterval(checkTenantConfig, 5000);

    return () => clearInterval(interval);
  }, [lastTenantConfig]);

  const generateAutomaticReports = async (tenantId: string, clientId: string) => {
    if (isGenerating) return;

    setIsGenerating(true);
    
    toast({
      title: "Generating O365 Reports",
      description: `Automatically generating reports for tenant ${tenantId.substring(0, 8)}...`,
    });

    try {
      // Clear existing reports
      setReports([]);

      // Generate all report types
      const reportTypes: O365Report['type'][] = [
        'user-activity',
        'license-usage', 
        'teams-activity',
        'sharepoint-usage',
        'security-score',
        'email-activity'
      ];

      // Create initial report entries
      const initialReports: O365Report[] = reportTypes.map(type => ({
        id: `${type}-${Date.now()}`,
        type,
        title: getReportTitle(type),
        data: null,
        generatedAt: new Date().toISOString(),
        status: 'generating',
        tenantId,
        clientId
      }));

      setReports(initialReports);

      // Generate each report with realistic delays
      for (let i = 0; i < reportTypes.length; i++) {
        const reportType = reportTypes[i];
        
        setTimeout(async () => {
          try {
            const reportData = await generateReportData(reportType, tenantId, clientId);
            
            setReports(prev => prev.map(report => 
              report.type === reportType 
                ? { ...report, data: reportData, status: 'completed' }
                : report
            ));

            if (i === 0) {
              // Update metrics with the first report (user activity)
              updateMetricsFromReports(reportData);
            }

            console.log(`Generated ${reportType} report for tenant ${tenantId.substring(0, 8)}...`);
            
          } catch (error) {
            console.error(`Error generating ${reportType} report:`, error);
            setReports(prev => prev.map(report => 
              report.type === reportType 
                ? { ...report, status: 'error' }
                : report
            ));
          }

          // Show completion toast for the last report
          if (i === reportTypes.length - 1) {
            setTimeout(() => {
              setIsGenerating(false);
              toast({
                title: "Reports Generated Successfully",
                description: `All O365 reports have been generated for tenant ${tenantId.substring(0, 8)}...`,
              });
            }, 1000);
          }
        }, (i + 1) * 2000); // Stagger report generation
      }

    } catch (error) {
      console.error('Error in automatic report generation:', error);
      setIsGenerating(false);
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate automatic reports. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const generateReportData = async (reportType: O365Report['type'], tenantId: string, clientId: string) => {
    // Simulate API calls to Microsoft Graph
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    switch (reportType) {
      case 'user-activity':
        return {
          totalUsers: 1247,
          activeUsers: 892,
          newUsers: 23,
          inactiveUsers: 355,
          dailyActiveUsers: [
            { date: '2024-01-15', users: 856 },
            { date: '2024-01-16', users: 923 },
            { date: '2024-01-17', users: 892 },
            { date: '2024-01-18', users: 945 },
            { date: '2024-01-19', users: 912 }
          ],
          topDepartments: [
            { name: 'Engineering', users: 234, active: 198 },
            { name: 'Sales', users: 156, active: 142 },
            { name: 'Marketing', users: 89, active: 76 },
            { name: 'HR', users: 45, active: 38 }
          ]
        };

      case 'license-usage':
        return {
          totalLicenses: 1500,
          assignedLicenses: 1247,
          availableLicenses: 253,
          licenseTypes: [
            { type: 'Microsoft 365 E3', total: 800, assigned: 678, cost: '$22/month' },
            { type: 'Microsoft 365 E5', total: 400, assigned: 345, cost: '$38/month' },
            { type: 'Microsoft 365 Business Premium', total: 300, assigned: 224, cost: '$22/month' }
          ],
          monthlyCost: 28456,
          utilizationRate: 83.1,
          trends: [
            { month: 'Jan', assigned: 1180, available: 320 },
            { month: 'Feb', assigned: 1205, available: 295 },
            { month: 'Mar', assigned: 1247, available: 253 }
          ]
        };

      case 'teams-activity':
        return {
          totalTeams: 156,
          activeTeams: 134,
          totalChannels: 892,
          activeChannels: 567,
          totalMessages: 45678,
          totalMeetings: 2345,
          averageMeetingDuration: 42,
          topTeams: [
            { name: 'Engineering Team', members: 45, messages: 2345, meetings: 89 },
            { name: 'Sales Team', members: 32, messages: 1876, meetings: 67 },
            { name: 'Marketing Team', members: 28, messages: 1456, meetings: 45 }
          ],
          dailyActivity: [
            { date: '2024-01-15', messages: 2345, meetings: 45 },
            { date: '2024-01-16', messages: 2567, meetings: 52 },
            { date: '2024-01-17', messages: 2234, meetings: 38 },
            { date: '2024-01-18', messages: 2789, meetings: 61 },
            { date: '2024-01-19', messages: 2456, meetings: 47 }
          ]
        };

      case 'sharepoint-usage':
        return {
          totalSites: 89,
          activeSites: 67,
          totalStorage: '2.4 TB',
          usedStorage: '1.8 TB',
          availableStorage: '0.6 TB',
          totalDocuments: 156789,
          documentsShared: 23456,
          topSites: [
            { name: 'Company Portal', visits: 12345, documents: 2345, storage: '245 GB' },
            { name: 'Engineering Hub', visits: 8976, documents: 1876, storage: '189 GB' },
            { name: 'Sales Resources', visits: 6543, documents: 1234, storage: '156 GB' }
          ],
          storageGrowth: [
            { month: 'Jan', used: 1.6, available: 0.9 },
            { month: 'Feb', used: 1.7, available: 0.8 },
            { month: 'Mar', used: 1.8, available: 0.6 }
          ]
        };

      case 'security-score':
        return {
          overallScore: 78,
          maxScore: 100,
          improvement: '+5 points',
          riskLevel: 'Medium',
          securityControls: [
            { name: 'Multi-Factor Authentication', score: 85, status: 'Good' },
            { name: 'Conditional Access', score: 72, status: 'Needs Improvement' },
            { name: 'Identity Protection', score: 90, status: 'Excellent' },
            { name: 'Data Loss Prevention', score: 65, status: 'Needs Improvement' }
          ],
          threats: [
            { type: 'Suspicious Sign-ins', count: 12, severity: 'Medium' },
            { type: 'Malware Detected', count: 3, severity: 'High' },
            { type: 'Phishing Attempts', count: 8, severity: 'Medium' }
          ],
          recommendations: [
            'Enable MFA for all admin accounts',
            'Configure conditional access policies',
            'Review and update DLP policies',
            'Implement privileged access management'
          ]
        };

      case 'email-activity':
        return {
          totalEmails: 234567,
          emailsSent: 156789,
          emailsReceived: 77778,
          averageEmailsPerUser: 188,
          topSenders: [
            { user: 'john.doe@company.com', sent: 2345, received: 1876 },
            { user: 'jane.smith@company.com', sent: 1987, received: 1654 },
            { user: 'mike.johnson@company.com', sent: 1765, received: 1432 }
          ],
          emailTrends: [
            { date: '2024-01-15', sent: 12345, received: 8976 },
            { date: '2024-01-16', sent: 13456, received: 9234 },
            { date: '2024-01-17', sent: 11234, received: 8567 },
            { date: '2024-01-18', sent: 14567, received: 9876 },
            { date: '2024-01-19', sent: 12789, received: 8765 }
          ],
          malwareBlocked: 45,
          phishingBlocked: 23,
          spamFiltered: 12456
        };

      default:
        return {};
    }
  };

  const updateMetricsFromReports = (userActivityData: any) => {
    setMetrics({
      totalUsers: userActivityData.totalUsers || 0,
      activeUsers: userActivityData.activeUsers || 0,
      licensesAssigned: 1247,
      licensesAvailable: 253,
      teamsActiveUsers: 892,
      sharepointSites: 67,
      emailsSent: 156789,
      securityScore: 78,
      lastUpdated: new Date().toISOString()
    });
  };

  const getReportTitle = (type: O365Report['type']): string => {
    const titles = {
      'user-activity': 'User Activity Report',
      'license-usage': 'License Usage Report',
      'teams-activity': 'Teams Activity Report',
      'sharepoint-usage': 'SharePoint Usage Report',
      'security-score': 'Security Score Report',
      'email-activity': 'Email Activity Report'
    };
    return titles[type];
  };

  const refreshReports = () => {
    if (lastTenantConfig) {
      generateAutomaticReports(lastTenantConfig.tenantId, lastTenantConfig.clientId);
    }
  };

  const getReportByType = (type: O365Report['type']) => {
    return reports.find(report => report.type === type);
  };

  return {
    reports,
    metrics,
    isGenerating,
    lastTenantConfig,
    refreshReports,
    getReportByType,
    generateAutomaticReports
  };
};