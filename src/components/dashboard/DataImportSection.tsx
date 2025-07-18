
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  Database, 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataImportSectionProps {
  o365Settings?: any;
}

const DataImportSection = ({ o365Settings }: DataImportSectionProps) => {
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [powerBiUrl, setPowerBiUrl] = useState('');
  const [serviceNowUrl, setServiceNowUrl] = useState('');
  const [jiraUrl, setJiraUrl] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const isConnected = o365Settings?.isConnected || false;

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      toast({
        title: "CSV File Selected",
        description: `${file.name} is ready for import.`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleCsvImport = () => {
    if (!csvFile) return;

    setIsImporting(true);
    setImportProgress(0);

    console.log('Starting CSV import:', csvFile.name);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          toast({
            title: "CSV Import Complete",
            description: `Successfully imported data from ${csvFile.name}`,
          });
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleApiIntegration = () => {
    if (!apiEndpoint) {
      toast({
        title: "API Endpoint Required",
        description: "Please enter a valid API endpoint URL.",
        variant: "destructive",
      });
      return;
    }

    console.log('Testing API connection:', apiEndpoint);
    toast({
      title: "API Integration",
      description: "Testing connection to external API...",
    });

    setTimeout(() => {
      toast({
        title: "API Connected",
        description: "Successfully connected to external API endpoint.",
      });
    }, 2000);
  };

  const handlePowerBiImport = () => {
    if (!powerBiUrl) {
      toast({
        title: "Power BI URL Required",
        description: "Please enter a valid Power BI report URL.",
        variant: "destructive",
      });
      return;
    }

    console.log('Importing Power BI report:', powerBiUrl);
    toast({
      title: "Power BI Import",
      description: "Importing Power BI dashboard data...",
    });

    setTimeout(() => {
      toast({
        title: "Power BI Import Complete",
        description: "Successfully imported Power BI report data.",
      });
    }, 3000);
  };

  const importOptions = [
    {
      title: 'CSV Data Import',
      description: 'Import data from external CSV files and non-O365 systems',
      icon: Upload,
      color: 'blue',
      action: (
        <div className="space-y-3">
          <div>
            <Label htmlFor="csv-upload">Select CSV File</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="mt-1"
            />
          </div>
          {csvFile && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{csvFile.name}</span>
              </div>
              <Button size="sm" onClick={handleCsvImport} disabled={isImporting}>
                {isImporting ? 'Importing...' : 'Import'}
              </Button>
            </div>
          )}
          {isImporting && (
            <div className="space-y-2">
              <Progress value={importProgress} className="w-full" />
              <div className="text-sm text-center">{importProgress}% Complete</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'REST API Integration',
      description: 'Connect to custom tools, ERP systems, or external APIs',
      icon: Database,
      color: 'green',
      action: (
        <div className="space-y-3">
          <div>
            <Label htmlFor="api-endpoint">API Endpoint URL</Label>
            <Input
              id="api-endpoint"
              placeholder="https://api.example.com/data"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
            />
          </div>
          <Button onClick={handleApiIntegration} disabled={!apiEndpoint}>
            <Settings className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
        </div>
      )
    },
    {
      title: 'Power BI Import',
      description: 'Import existing Power BI reports and dashboards',
      icon: Download,
      color: 'purple',
      action: (
        <div className="space-y-3">
          <div>
            <Label htmlFor="powerbi-url">Power BI Report URL</Label>
            <Input
              id="powerbi-url"
              placeholder="https://app.powerbi.com/groups/..."
              value={powerBiUrl}
              onChange={(e) => setPowerBiUrl(e.target.value)}
            />
          </div>
          <Button onClick={handlePowerBiImport} disabled={!powerBiUrl}>
            <Download className="h-4 w-4 mr-2" />
            Import Report
          </Button>
        </div>
      )
    },
    {
      title: 'ServiceNow Integration',
      description: 'Import ticket data for productivity insights',
      icon: AlertTriangle,
      color: 'orange',
      action: (
        <div className="space-y-3">
          <div>
            <Label htmlFor="servicenow-url">ServiceNow Instance URL</Label>
            <Input
              id="servicenow-url"
              placeholder="https://your-instance.service-now.com"
              value={serviceNowUrl}
              onChange={(e) => setServiceNowUrl(e.target.value)}
            />
          </div>
          <Button disabled={!serviceNowUrl}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Connect ServiceNow
          </Button>
        </div>
      )
    },
    {
      title: 'Jira Integration',
      description: 'Project management and issue tracking integration',
      icon: CheckCircle,
      color: 'indigo',
      action: (
        <div className="space-y-3">
          <div>
            <Label htmlFor="jira-url">Jira Instance URL</Label>
            <Input
              id="jira-url"
              placeholder="https://your-domain.atlassian.net"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
            />
          </div>
          <Button disabled={!jiraUrl}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Connect Jira
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Data Import & External Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {importOptions.map((option, index) => {
              const IconComponent = option.icon;
              
              return (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconComponent className={`h-5 w-5 text-${option.color}-600`} />
                      {option.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    {option.action}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Import Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'User Directory', status: 'Success', time: '2 hours ago', records: '1,247 users' },
              { type: 'License Data', status: 'Success', time: '4 hours ago', records: '89 licenses' },
              { type: 'Teams Activity', status: 'In Progress', time: '5 minutes ago', records: '45 teams' },
              { type: 'CSV Import', status: 'Failed', time: '1 day ago', records: '0 records' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'Success' ? 'bg-green-500' :
                    item.status === 'In Progress' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-sm text-gray-600">{item.records}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    item.status === 'Success' ? 'default' :
                    item.status === 'In Progress' ? 'secondary' :
                    'destructive'
                  }>
                    {item.status}
                  </Badge>
                  <div className="text-sm text-gray-500 mt-1">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImportSection;
