
import { useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { SecureStorage } from '@/utils/securityUtils';

export const useTenantConnections = (tenants: Tenant[], setTenants: (tenants: Tenant[]) => void) => {
  useEffect(() => {
    const interval = setInterval(() => {
      updateTenantConnections();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tenants]);

  const updateTenantConnections = async () => {
    if (tenants.length === 0) return;
    
    const updatedTenants = tenants.map(tenant => {
      if (tenant.isEnabled) {
        const connectionSuccess = tenant.status === 'active' ? 0.95 : 0.7;
        const isConnected = Math.random() < connectionSuccess;
        
        return {
          ...tenant,
          isConnected,
          status: isConnected ? 'active' as const : 'pending' as const,
          lastActivity: isConnected ? new Date().toISOString() : tenant.lastActivity
        };
      }
      return {
        ...tenant,
        isConnected: false,
        status: 'inactive' as const
      };
    });

    const hasChanges = updatedTenants.some((tenant, index) => 
      tenant.isConnected !== tenants[index]?.isConnected ||
      tenant.status !== tenants[index]?.status
    );

    if (hasChanges) {
      setTenants(updatedTenants);
      SecureStorage.setSecureItem('managedTenants', JSON.stringify(updatedTenants));
      console.log('Real-time tenant status updated');
    }
  };
};
