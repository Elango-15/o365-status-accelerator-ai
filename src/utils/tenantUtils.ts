
import { Tenant } from '@/types/tenant';

export const generateTenantId = (): string => {
  // Generate a realistic-looking tenant ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const generateClientId = (): string => {
  // Generate a realistic-looking client ID
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  });
};

export const getInitialTenants = (): Tenant[] => {
  return [
    {
      id: '1',
      name: 'CD',
      domain: 'cdtech.cloud',
      tenantId: 'ad5cd7c6-bcb2-4a2d-9106-28df885282df',
      clientId: '096e13b5-7874-4827-ba5a-0006f1e1fd0d',
      isEnabled: true,
      isConnected: true,
      adminEmail: 'elango@cdtech.cloud',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      userCount: 1250,
      licenseCount: 1500,
      status: 'active'
    }
  ];
};
