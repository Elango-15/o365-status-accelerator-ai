import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GraphApiService, O365User, O365Group, O365Site, O365License, O365TenantInfo } from '@/services/graphApiService';
import { AuthService } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';
import { useO365Mail } from './useO365Mail';
import { useO365Teams } from './useO365Teams';
import { useO365Permissions } from './useO365Permissions';

export interface O365CoreData {
  users: O365User[];
  groups: O365Group[];
  sites: O365Site[];
  licenses: O365License[];
  tenantInfo: O365TenantInfo | null;
  lastSync: string | null;
  isConnected: boolean;
}

export interface SyncStatus {
  isLoading: boolean;
  error: string | null;
  progress: number;
  lastSync: string | null;
}

export const useO365DataSync = () => {
  const [coreData, setCoreData] = useState<O365CoreData>({
    users: [],
    groups: [],
    sites: [],
    licenses: [],
    tenantInfo: null,
    lastSync: null,
    isConnected: false
  });

  // Use specialized hooks for different data types
  const mailHook = useO365Mail();
  const teamsHook = useO365Teams();
  const permissionsHook = useO365Permissions();

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    error: null,
    progress: 0,
    lastSync: null
  });

  const { toast } = useToast();

  // Check if O365 integration is enabled and user is authenticated
  const canSync = useCallback(() => {
    return ENV_CONFIG.ENABLE_O365_INTEGRATION && 
           AuthService.isAuthenticated() && 
           AuthService.hasPermission('access_graph_api');
  }, []);

  // Sync core O365 data (users, groups, sites, licenses, tenant info)
  const syncCoreData = useCallback(async () => {
    if (!canSync()) {
      setSyncStatus(prev => ({ 
        ...prev, 
        error: 'O365 integration not enabled or user not authenticated' 
      }));
      return;
    }

    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null, progress: 0 }));

    try {
      setSyncStatus(prev => ({ ...prev, progress: 10 }));
      const healthStatus = await GraphApiService.healthCheck();
      
      if (healthStatus.status === 'unhealthy') {
        throw new Error(healthStatus.details);
      }

      setSyncStatus(prev => ({ ...prev, progress: 30 }));
      const [usersData, groups, sites, licenses, tenantInfo] = await Promise.all([
        GraphApiService.getUsers(500),
        GraphApiService.getGroups(),
        GraphApiService.getSites(),
        GraphApiService.getSubscribedSkus(),
        GraphApiService.getTenantInfo()
      ]);

      setSyncStatus(prev => ({ ...prev, progress: 80 }));
      const now = new Date().toISOString();

      setCoreData({
        users: usersData.users,
        groups,
        sites,
        licenses,
        tenantInfo,
        lastSync: now,
        isConnected: true
      });

      setSyncStatus({
        isLoading: false,
        error: null,
        progress: 100,
        lastSync: now
      });

      toast({
        title: "Core O365 Data Synced",
        description: `Synced ${usersData.users.length} users, ${groups.length} groups, ${sites.length} sites.`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      
      setSyncStatus({
        isLoading: false,
        error: errorMessage,
        progress: 0,
        lastSync: coreData.lastSync
      });

      setCoreData(prev => ({ ...prev, isConnected: false }));

      toast({
        title: "O365 Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [canSync, toast, coreData.lastSync]);

  // Comprehensive sync of all data
  const syncAllData = useCallback(async () => {
    await Promise.all([
      syncCoreData(),
      mailHook.syncMail(),
      teamsHook.syncTeams(),
      permissionsHook.syncPermissions()
    ]);
  }, [syncCoreData, mailHook.syncMail, teamsHook.syncTeams, permissionsHook.syncPermissions]);

  // Individual sync methods for core data
  const syncUsers = useCallback(async () => {
    if (!canSync()) return;

    try {
      const usersData = await GraphApiService.getUsers(500);
      setCoreData(prev => ({
        ...prev,
        users: usersData.users,
        lastSync: new Date().toISOString()
      }));

      toast({
        title: "Users Synced",
        description: `Updated ${usersData.users.length} users from O365.`,
      });
    } catch (error) {
      toast({
        title: "User Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync users',
        variant: "destructive",
      });
    }
  }, [canSync, toast]);

  const syncGroups = useCallback(async () => {
    if (!canSync()) return;

    try {
      const groups = await GraphApiService.getGroups();
      setCoreData(prev => ({
        ...prev,
        groups,
        lastSync: new Date().toISOString()
      }));

      toast({
        title: "Groups Synced",
        description: `Updated ${groups.length} groups from O365.`,
      });
    } catch (error) {
      toast({
        title: "Group Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync groups',
        variant: "destructive",
      });
    }
  }, [canSync, toast]);

  // Auto-sync setup
  useEffect(() => {
    if (!ENV_CONFIG.ENABLE_REAL_TIME_SYNC || !canSync()) {
      return;
    }

    // Initial sync on mount
    syncAllData();

    // Set up periodic sync (every 10 minutes)
    const syncInterval = setInterval(() => {
      if (canSync()) {
        console.log('Performing automatic O365 data sync...');
        syncAllData();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [canSync, syncAllData]);

  // Comprehensive dashboard metrics
  const getDashboardMetrics = useCallback(() => {
    if (!coreData.isConnected) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalGroups: 0,
        totalSites: 0,
        licensedUsers: 0,
        availableLicenses: 0,
        totalEmails: 0,
        unreadEmails: 0,
        totalTeams: 0,
        activeTeams: 0,
        totalPermissions: 0
      };
    }

    const activeUsers = coreData.users.filter(user => user.accountEnabled).length;
    const licensedUsers = coreData.users.filter(user => user.assignedLicenses.length > 0).length;
    const totalLicenses = coreData.licenses.reduce((sum, license) => sum + license.assignedLicenses, 0);
    const availableLicenses = coreData.licenses.reduce((sum, license) => sum + license.availableLicenses, 0);
    
    const teamsMetrics = teamsHook.getTeamsMetrics();
    const permissionsMetrics = permissionsHook.getPermissionsMetrics();

    return {
      totalUsers: coreData.users.length,
      activeUsers,
      totalGroups: coreData.groups.length,
      totalSites: coreData.sites.length,
      licensedUsers,
      totalLicenses,
      availableLicenses,
      totalEmails: mailHook.mailData.mail.length,
      unreadEmails: mailHook.mailData.unreadMailCount,
      totalTeams: teamsMetrics.totalTeams,
      activeTeams: teamsMetrics.activeTeams,
      totalPermissions: permissionsMetrics.totalPermissions
    };
  }, [coreData, mailHook.mailData, teamsHook.getTeamsMetrics, permissionsHook.getPermissionsMetrics]);

  // Get license utilization data
  const getLicenseUtilization = useCallback(() => {
    return coreData.licenses.map(license => ({
      name: license.skuPartNumber,
      assigned: license.assignedLicenses,
      available: license.availableLicenses,
      total: license.assignedLicenses + license.availableLicenses,
      utilization: license.assignedLicenses / (license.assignedLicenses + license.availableLicenses) * 100
    }));
  }, [coreData.licenses]);

  // Combine all data for backwards compatibility
  const o365Data = {
    ...coreData,
    mail: mailHook.mailData.mail,
    teams: teamsHook.teamsData.teams,
    permissions: permissionsHook.permissionsData.permissions,
    mailFolders: mailHook.mailData.mailFolders,
    unreadMailCount: mailHook.mailData.unreadMailCount
  };

  return {
    // Core data
    coreData,
    o365Data, // For backwards compatibility
    syncStatus,
    
    // Sync methods
    syncAllData,
    syncCoreData,
    syncUsers,
    syncGroups,
    
    // Specialized hooks
    mailHook,
    teamsHook,
    permissionsHook,
    
    // Metrics
    getDashboardMetrics,
    getLicenseUtilization,
    canSync: canSync()
  };
};
