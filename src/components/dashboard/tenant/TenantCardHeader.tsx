
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Wifi, WifiOff, Square } from 'lucide-react';
import { Tenant } from '@/types/tenant';

interface TenantCardHeaderProps {
  tenant: Tenant;
}

const TenantCardHeader: React.FC<TenantCardHeaderProps> = ({ tenant }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConnectionBadge = () => {
    if (!tenant.isEnabled) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <Square className="h-3 w-3 mr-1" />
          Disabled
        </Badge>
      );
    }
    
    return tenant.isConnected ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Wifi className="h-3 w-3 mr-1" />
        Connected
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
        <WifiOff className="h-3 w-3 mr-1" />
        Disconnected
      </Badge>
    );
  };

  return (
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{tenant.name}</CardTitle>
            <p className="text-sm text-gray-600">{tenant.domain}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={getStatusColor(tenant.status)}>
            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
          </Badge>
          {getConnectionBadge()}
        </div>
      </div>
    </CardHeader>
  );
};

export default TenantCardHeader;
