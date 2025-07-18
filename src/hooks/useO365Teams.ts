import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GraphApiService, O365Team } from '@/services/graphApiService';
import { AuthService } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export interface TeamsData {
  teams: O365Team[];
  lastSync: string | null;
}

export const useO365Teams = () => {
  const [teamsData, setTeamsData] = useState<TeamsData>({
    teams: [],
    lastSync: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const canSync = useCallback(() => {
    return ENV_CONFIG.ENABLE_O365_INTEGRATION && 
           AuthService.isAuthenticated() && 
           AuthService.hasPermission('access_graph_api');
  }, []);

  const syncTeams = useCallback(async () => {
    if (!canSync()) return;

    setIsLoading(true);
    try {
      const teams = await GraphApiService.getJoinedTeams();
      
      // Enhance teams with channels and member count
      const teamsWithDetails = await Promise.all(
        teams.map(async (team) => {
          try {
            const [channels, members] = await Promise.all([
              GraphApiService.getTeamChannels(team.id),
              GraphApiService.getTeamMembers(team.id)
            ]);
            return {
              ...team,
              channels,
              memberCount: members.length
            };
          } catch (error) {
            console.warn(`Failed to get details for team ${team.id}:`, error);
            return team;
          }
        })
      );

      const now = new Date().toISOString();
      setTeamsData({
        teams: teamsWithDetails,
        lastSync: now
      });

      toast({
        title: "Teams Synced",
        description: `Updated ${teamsWithDetails.length} teams from O365.`,
      });
    } catch (error) {
      toast({
        title: "Teams Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync teams',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [canSync, toast]);

  const getTeamsMetrics = useCallback(() => {
    const activeTeams = teamsData.teams.filter(team => !team.isArchived).length;
    return {
      totalTeams: teamsData.teams.length,
      activeTeams,
      archivedTeams: teamsData.teams.length - activeTeams
    };
  }, [teamsData.teams]);

  return {
    teamsData,
    isLoading,
    syncTeams,
    getTeamsMetrics,
    canSync: canSync()
  };
};