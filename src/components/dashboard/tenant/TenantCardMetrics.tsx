
import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { Tenant } from '@/types/tenant';

interface TenantCardMetricsProps {
  tenant: Tenant;
}

const TenantCardMetrics: React.FC<TenantCardMetricsProps> = ({ tenant }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{tenant.userCount || 0} users</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Added {formatDate(tenant.createdAt)}</span>
        </div>
      </div>

      {/* License Usage */}
      {tenant.licenseCount && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">License Usage</span>
            <span>{tenant.userCount}/{tenant.licenseCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${Math.min((tenant.userCount || 0) / tenant.licenseCount * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Real-time Last Activity */}
      <div className="text-sm text-gray-600">
        Last activity: {formatDate(tenant.lastActivity)}
      </div>
    </div>
  );
};

export default TenantCardMetrics;
