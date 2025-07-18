import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GraphApiService, O365Mail } from '@/services/graphApiService';
import { AuthService } from '@/utils/authUtils';
import { ENV_CONFIG } from '@/utils/environmentConfig';

export interface MailData {
  mail: O365Mail[];
  mailFolders: any[];
  unreadMailCount: number;
  lastSync: string | null;
}

export const useO365Mail = () => {
  const [mailData, setMailData] = useState<MailData>({
    mail: [],
    mailFolders: [],
    unreadMailCount: 0,
    lastSync: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const canSync = useCallback(() => {
    return ENV_CONFIG.ENABLE_O365_INTEGRATION && 
           AuthService.isAuthenticated() && 
           AuthService.hasPermission('access_graph_api');
  }, []);

  const syncMail = useCallback(async () => {
    if (!canSync()) return;

    setIsLoading(true);
    try {
      const [mail, mailFolders, unreadCount] = await Promise.all([
        GraphApiService.getMailMessages(100),
        GraphApiService.getMailFolders(),
        GraphApiService.getUnreadMailCount()
      ]);

      const now = new Date().toISOString();
      setMailData({
        mail,
        mailFolders,
        unreadMailCount: unreadCount,
        lastSync: now
      });

      toast({
        title: "Mail Synced",
        description: `Updated ${mail.length} emails and ${unreadCount} unread messages.`,
      });
    } catch (error) {
      toast({
        title: "Mail Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync mail',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [canSync, toast]);

  return {
    mailData,
    isLoading,
    syncMail,
    canSync: canSync()
  };
};