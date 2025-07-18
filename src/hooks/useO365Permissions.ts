import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GraphApiService, O365Permission } from '@/services/graphApiService';
import { AuthService } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export interface PermissionsData {
  permissions: O365Permission[];
  directoryRoles: any[];
  lastSync: string | null;
}

export const useO365Permissions = () => {
  const [permissionsData, setPermissionsData] = useState<PermissionsData>({
    permissions: [],
    directoryRoles: [],
    lastSync: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const canSync = useCallback(() => {
    return ENV_CONFIG.ENABLE_O365_INTEGRATION && 
           AuthService.isAuthenticated() && 
           AuthService.hasPermission('access_graph_api');
  }, []);

  const syncPermissions = useCallback(async () => {
    if (!canSync()) return;

    setIsLoading(true);
    try {
      const [userPermissions, directoryRoles] = await Promise.all([
        GraphApiService.getUserRoleAssignments(),
        GraphApiService.getDirectoryRoles()
      ]);

      const now = new Date().toISOString();
      setPermissionsData({
        permissions: userPermissions,
        directoryRoles,
        lastSync: now
      });

      toast({
        title: "Permissions Synced",
        description: `Updated ${userPermissions.length} permissions from O365.`,
      });
    } catch (error) {
      toast({
        title: "Permissions Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync permissions',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [canSync, toast]);

  const getPermissionsMetrics = useCallback(() => {
    const activePermissions = permissionsData.permissions.filter(p => p.isActive).length;
    return {
      totalPermissions: permissionsData.permissions.length,
      activePermissions,
      inactivePermissions: permissionsData.permissions.length - activePermissions,
      totalRoles: permissionsData.directoryRoles.length
    };
  }, [permissionsData]);

  return {
    permissionsData,
    isLoading,
    syncPermissions,
    getPermissionsMetrics,
    canSync: canSync()
  };
};