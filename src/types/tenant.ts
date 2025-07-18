
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  tenantId: string;
  clientId: string;
  isEnabled: boolean;
  isConnected: boolean;
  adminEmail: string;
  createdAt: string;
  lastActivity?: string;
  userCount?: number;
  licenseCount?: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

export type TenantUpdate = Partial<Tenant>;
