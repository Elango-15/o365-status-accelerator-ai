
import { useState, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { SecureStorage } from '@/utils/securityUtils';
import { getInitialTenants } from '@/utils/tenantUtils';
import { useToast } from '@/hooks/use-toast';

export const useTenantStorage = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedTenants = SecureStorage.getSecureItem('managedTenants');
      if (savedTenants) {
        const parsedTenants = JSON.parse(savedTenants);
        setTenants(parsedTenants);
        console.log('Loaded tenants from storage:', parsedTenants.length);
      } else {
        const initialTenants = getInitialTenants();
        setTenants(initialTenants);
        SecureStorage.setSecureItem('managedTenants', JSON.stringify(initialTenants));
        console.log('Initialized with real environment tenants');
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast({
        title: "Error Loading Tenants",
        description: "Failed to load tenant data from storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveTenants = (updatedTenants: Tenant[]) => {
    try {
      SecureStorage.setSecureItem('managedTenants', JSON.stringify(updatedTenants));
      setTenants(updatedTenants);
      console.log('Tenants saved successfully');
    } catch (error) {
      console.error('Error saving tenants:', error);
      toast({
        title: "Save Error",
        description: "Failed to save tenant data.",
        variant: "destructive",
      });
    }
  };

  return {
    tenants,
    setTenants,
    saveTenants
  };
};
