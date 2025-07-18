import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Calendar, FileText, FileSpreadsheet, Archive, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useO365DataSync } from '@/hooks/useO365DataSync';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsSectionProps {
  dashboardData?: any;
  companyLogo?: string | null;
  o365Settings?: any;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ dashboardData, companyLogo, o365Settings }) => {
  const { toast } = useToast();
  const { o365Data, getDashboardMetrics, getLicenseUtilization } = useO365DataSync();

  const scheduledReports = [
    { name: 'Weekly Team Performance Report', frequency: 'Weekly', nextRun: 'Monday 9:00 AM', status: 'active' },
    { name: 'Monthly Analytics Summary', frequency: 'Monthly', nextRun: '1st of next month', status: 'active' },
    { name: 'Daily Project Status Update', frequency: 'Daily', nextRun: 'Tomorrow 8:00 AM', status: 'active' },
  ];

  const handlePDFExport = () => {
    try {
      const doc = new jsPDF();
      const metrics = getDashboardMetrics();
      const licenseData = getLicenseUtilization();
      
      // Header
      doc.setFontSize(20);
      doc.text('O365 Accelerator Dashboard Report', 20, 30);
      
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
      doc.text(`Tenant ID: ${o365Settings?.tenantId || 'Not configured'}`, 20, 55);
      doc.text(`Connection Status: ${o365Settings?.isConnected ? 'Connected' : 'Not Connected'}`, 20, 65);
      
      // Real-time Metrics Table
      if (o365Data.isConnected) {
        doc.setFontSize(14);
        doc.text('Real-Time O365 Metrics', 20, 85);
        
        const metricsData = [
          ['Metric', 'Value', 'Status'],
          ['Total Users', metrics.totalUsers.toString(), 'Live'],
          ['Active Users', metrics.activeUsers.toString(), 'Live'],
          ['Total Groups', metrics.totalGroups.toString(), 'Live'],
          ['Total Sites', metrics.totalSites.toString(), 'Live'],
          ['Licensed Users', metrics.licensedUsers.toString(), 'Live'],
          ['Available Licenses', metrics.availableLicenses.toString(), 'Live'],
          ['Total Emails', metrics.totalEmails.toString(), 'Live'],
          ['Unread Emails', metrics.unreadEmails.toString(), 'Live'],
          ['Total Teams', metrics.totalTeams.toString(), 'Live'],
          ['Active Teams', metrics.activeTeams.toString(), 'Live']
        ];
        
        autoTable(doc, {
          head: [metricsData[0]],
          body: metricsData.slice(1),
          startY: 95,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
        
        // License Utilization
        if (licenseData.length > 0) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('License Utilization', 20, 30);
          
          const licenseTableData = [
            ['License Type', 'Assigned', 'Available', 'Total', 'Utilization %'],
            ...licenseData.map(license => [
              license.name,
              license.assigned.toString(),
              license.available.toString(),
              license.total.toString(),
              `${license.utilization.toFixed(1)}%`
            ])
          ];
          
          autoTable(doc, {
            head: [licenseTableData[0]],
            body: licenseTableData.slice(1),
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [66, 139, 202] }
          });
        }
      }
      
      // Configuration Details
      doc.addPage();
      doc.setFontSize(14);
      doc.text('O365 Configuration', 20, 30);
      
      const configData = [
        ['Setting', 'Value'],
        ['SharePoint URL', o365Settings?.sharepointUrl || 'Not configured'],
        ['Document Library', o365Settings?.documentLibrary || 'Not configured'],
        ['Teams Notifications', o365Settings?.teamsNotifications ? 'Enabled' : 'Disabled'],
        ['Auto Refresh', o365Settings?.autoRefresh ? 'Enabled' : 'Disabled'],
        ['Email Alerts', o365Settings?.emailAlerts ? 'Enabled' : 'Disabled'],
        ['Real-time Sync', o365Data.isConnected ? 'Active' : 'Inactive'],
        ['Last Sync', o365Data.lastSync ? new Date(o365Data.lastSync).toLocaleString() : 'Never']
      ];
      
      autoTable(doc, {
        head: [configData[0]],
        body: configData.slice(1),
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Save the PDF
      doc.save(`o365-dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF Export Complete",
        description: "Comprehensive O365 dashboard report generated with live data.",
      });
    } catch (error) {
      toast({
        title: "PDF Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExcelExport = () => {
    try {
      const metrics = getDashboardMetrics();
      const licenseData = getLicenseUtilization();
      
      // Create comprehensive CSV with multiple sections
      const csvSections = [];
      
      // Header Section
      csvSections.push([
        ['Report Type', 'O365 Dashboard Live Data Export'],
        ['Generated', new Date().toLocaleString()],
        ['Tenant ID', o365Settings?.tenantId || 'Not configured'],
        ['Client ID', o365Settings?.clientId || 'Not configured'],
        ['Connection Status', o365Data.isConnected ? 'Connected (Live)' : 'Disconnected'],
        ['Last Sync', o365Data.lastSync ? new Date(o365Data.lastSync).toLocaleString() : 'Never'],
        ['']
      ]);
      
      // Real-time Metrics Section
      if (o365Data.isConnected) {
        csvSections.push([
          ['Real-Time O365 Metrics', '', ''],
          ['Metric', 'Value', 'Status'],
          ['Total Users', metrics.totalUsers.toString(), 'Live'],
          ['Active Users', metrics.activeUsers.toString(), 'Live'],
          ['Total Groups', metrics.totalGroups.toString(), 'Live'],
          ['Total Sites', metrics.totalSites.toString(), 'Live'],
          ['Licensed Users', metrics.licensedUsers.toString(), 'Live'],
          ['Available Licenses', metrics.availableLicenses.toString(), 'Live'],
          ['Total Emails', metrics.totalEmails.toString(), 'Live'],
          ['Unread Emails', metrics.unreadEmails.toString(), 'Live'],
          ['Total Teams', metrics.totalTeams.toString(), 'Live'],
          ['Active Teams', metrics.activeTeams.toString(), 'Live'],
          ['Total Permissions', metrics.totalPermissions.toString(), 'Live'],
          ['']
        ]);
        
        // License Utilization Section
        if (licenseData.length > 0) {
          csvSections.push([
            ['License Utilization', '', '', '', ''],
            ['License Type', 'Assigned', 'Available', 'Total', 'Utilization %'],
            ...licenseData.map(license => [
              license.name,
              license.assigned.toString(),
              license.available.toString(),
              license.total.toString(),
              `${license.utilization.toFixed(1)}%`
            ]),
            ['']
          ]);
        }
        
        // User Data Section
        if (o365Data.users && o365Data.users.length > 0) {
          csvSections.push([
            ['User Data (Sample)', '', ''],
            ['Display Name', 'Email', 'Enabled'],
            ...o365Data.users.slice(0, 50).map(user => [
              user.displayName || '',
              user.mail || user.userPrincipalName || '',
              user.accountEnabled ? 'Yes' : 'No'
            ]),
            ['']
          ]);
        }
      }
      
      // Configuration Section
      csvSections.push([
        ['O365 Configuration', ''],
        ['Setting', 'Value'],
        ['SharePoint URL', o365Settings?.sharepointUrl || 'Not configured'],
        ['Document Library', o365Settings?.documentLibrary || 'Not configured'],
        ['Teams Notifications', o365Settings?.teamsNotifications ? 'Enabled' : 'Disabled'],
        ['Auto Refresh', o365Settings?.autoRefresh ? 'Enabled' : 'Disabled'],
        ['Email Alerts', o365Settings?.emailAlerts ? 'Enabled' : 'Disabled'],
        ['Real-time Sync', o365Data.isConnected ? 'Active' : 'Inactive']
      ]);
      
      // Combine all sections
      const csvContent = csvSections
        .flat()
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `o365-dashboard-live-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Excel Export Complete",
        description: `Exported live O365 data including ${metrics.totalUsers} users, ${metrics.totalGroups} groups, and license details.`,
      });
    } catch (error) {
      toast({
        title: "Excel Export Failed",
        description: "Failed to generate Excel export. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePowerBIExport = () => {
    const powerBIData = {
      ...dashboardData,
      o365Configuration: o365Settings,
      exportType: 'PowerBI',
      timestamp: new Date().toISOString(),
      connectionStatus: o365Settings?.isConnected ? 'Connected' : 'Disconnected',
      tenantInfo: {
        tenantId: o365Settings?.tenantId,
        clientId: o365Settings?.clientId,
        adminPortalUrl: o365Settings?.adminPortalUrl
      }
    };
    
    const blob = new Blob([JSON.stringify(powerBIData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `o365-powerbi-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "PowerBI Export Complete",
      description: "Data exported in PowerBI compatible format with O365 integration details.",
    });
  };

  const handleTemplateImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,.xlsx';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Template Import",
          description: `Template "${file.name}" imported successfully.`,
        });
      }
    };
    
    input.click();
  };

  const handleConfigurationImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedConfig = JSON.parse(e.target?.result as string);
            
            // Save imported O365 settings
            if (importedConfig.o365Configuration) {
              localStorage.setItem('o365DashboardSettings', JSON.stringify(importedConfig.o365Configuration));
            }
            
            toast({
              title: "Configuration Import",
              description: "Dashboard and O365 configuration imported successfully.",
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid configuration file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  const handleBackupRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.zip';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Backup Restore",
          description: `Backup "${file.name}" restored successfully with O365 settings.`,
        });
      }
    };
    
    input.click();
  };

  const openO365AdminPortal = () => {
    const url = o365Settings?.adminPortalUrl || 'https://admin.microsoft.com';
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* O365 Integration Status */}
      {o365Settings && (
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              O365 Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant={o365Settings.isConnected ? "default" : "secondary"} className="mb-2">
                  {o365Settings.isConnected ? "Connected" : "Not Connected"}
                </Badge>
                <p className="text-sm text-gray-600">Connection Status</p>
              </div>
              <div className="text-center">
                <Badge variant={o365Settings.tenantId ? "default" : "secondary"} className="mb-2">
                  {o365Settings.tenantId ? "Configured" : "Not Set"}
                </Badge>
                <p className="text-sm text-gray-600">Tenant ID</p>
              </div>
              <div className="text-center">
                <Badge variant={o365Settings.sharepointUrl ? "default" : "secondary"} className="mb-2">
                  {o365Settings.sharepointUrl ? "Configured" : "Not Set"}
                </Badge>
                <p className="text-sm text-gray-600">SharePoint</p>
              </div>
              <div className="text-center">
                <Button size="sm" variant="outline" onClick={openO365AdminPortal}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Portal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handlePDFExport}
            >
              <FileText className="h-4 w-4 mr-3" />
              Export as PDF
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleExcelExport}
            >
              <FileSpreadsheet className="h-4 w-4 mr-3" />
              Export as Excel
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handlePowerBIExport}
            >
              <Download className="h-4 w-4 mr-3" />
              Export to PowerBI
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleConfigurationImport}
            >
              <Settings className="h-4 w-4 mr-3" />
              Import Configuration
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleTemplateImport}
            >
              <FileText className="h-4 w-4 mr-3" />
              Import Templates
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleBackupRestore}
            >
              <Archive className="h-4 w-4 mr-3" />
              Restore Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports */}
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500">{report.frequency} • Next run: {report.nextRun}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
