
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tenant } from '@/types/tenant';
import TenantCardHeader from './tenant/TenantCardHeader';
import TenantCardDetails from './tenant/TenantCardDetails';
import TenantCardMetrics from './tenant/TenantCardMetrics';
import TenantCardActions from './tenant/TenantCardActions';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface TenantCardProps {
  tenant: Tenant;
  loading: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onTestConnection: () => void;
  onDelete: () => void;
}

const TenantCard: React.FC<TenantCardProps> = ({
  tenant,
  loading,
  onEnable,
  onDisable,
  onTestConnection,
  onDelete
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${tenant.isConnected ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
      <TenantCardHeader tenant={tenant} />
      
      <CardContent className="space-y-4">
        {/* Real-time Configuration Status */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Real-time Configuration</span>
            <Badge className={tenant.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {tenant.isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-600" />
              <span>Auto-sync: {tenant.isEnabled ? 'On' : 'Off'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-600" />
              <span>Status: {tenant.status}</span>
            </div>
          </div>
        </div>
        
        <TenantCardDetails tenant={tenant} />
        <TenantCardMetrics tenant={tenant} />
        <TenantCardActions
          tenant={tenant}
          loading={loading}
          onEnable={onEnable}
          onDisable={onDisable}
          onTestConnection={onTestConnection}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};

export default TenantCard;
