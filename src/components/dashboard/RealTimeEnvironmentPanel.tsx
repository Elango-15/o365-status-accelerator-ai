import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  RefreshCcw, 
  Clock, 
  Users, 
  Mail, 
  MessageSquare,
  Shield,
  Activity,
  ExternalLink 
} from 'lucide-react';
import { useO365DataSync } from '@/hooks/useO365DataSync';
import { ENV_CONFIG } from '@/utils/environmentConfig';

const RealTimeEnvironmentPanel = () => {
  const { o365Data, syncStatus, getDashboardMetrics, syncAllData } = useO365DataSync();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const metrics = getDashboardMetrics();

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (o365Data.isConnected) {
        syncAllData();
        setLastRefresh(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [o365Data.isConnected, syncAllData]);

  const handleManualRefresh = () => {
    syncAllData();
    setLastRefresh(new Date());
  };

  const openAdminPortal = () => {
    window.open('https://admin.microsoft.com', '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <Server className="h-5 w-5" />
            Real-Time O365 Environment
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleManualRefresh}
              disabled={syncStatus.isLoading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncStatus.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={openAdminPortal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Admin Portal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {o365Data.isConnected ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live Connected (CD Tenant)
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Tenant: ad5cd7c6-bcb2-4a2d-9106-28df885282df</div>
              <div>Client: 096e13b5-7874-4827-ba5a-0006f1e1fd0d</div>
              <div className="text-xs text-green-600 mt-1">✓ Real-time sync enabled</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Sync</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {o365Data.lastSync ? new Date(o365Data.lastSync).toLocaleTimeString() : 'Never'}
            </div>
            <div className="text-xs text-muted-foreground">
              Auto-refresh: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">API Status</span>
            </div>
            {syncStatus.isLoading ? (
              <Badge variant="secondary">Syncing...</Badge>
            ) : syncStatus.error ? (
              <Badge variant="destructive">Error</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
            )}
          </div>
        </div>

        {/* Real-Time Metrics */}
        {o365Data.isConnected && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
              <div className="text-xs text-green-600">{metrics.activeUsers} active</div>
            </div>

            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <Mail className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{metrics.totalEmails}</div>
              <div className="text-xs text-muted-foreground">Emails</div>
              <div className="text-xs text-red-600">{metrics.unreadEmails} unread</div>
            </div>

            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{metrics.totalTeams}</div>
              <div className="text-xs text-muted-foreground">Teams</div>
              <div className="text-xs text-green-600">{metrics.activeTeams} active</div>
            </div>

            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{metrics.licensedUsers}</div>
              <div className="text-xs text-muted-foreground">Licensed</div>
              <div className="text-xs text-blue-600">{metrics.availableLicenses} available</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {syncStatus.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              <strong>Sync Error:</strong> {syncStatus.error}
            </div>
          </div>
        )}

        {/* Integration Status */}
        <div className="text-xs text-muted-foreground text-center">
          Environment: {ENV_CONFIG.IS_DEVELOPMENT ? 'Development' : 'Production'} | 
          Real-time Sync: {ENV_CONFIG.ENABLE_REAL_TIME_SYNC ? 'Enabled' : 'Disabled'} | 
          SSO: {ENV_CONFIG.ENABLE_SSO ? 'Enabled' : 'Disabled'}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeEnvironmentPanel;