
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService, PERMISSIONS } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';

interface QuickSetupCardProps {
  onEnableAll: () => void;
}

const QuickSetupCard: React.FC<QuickSetupCardProps> = ({ onEnableAll }) => {
  const { toast } = useToast();
  const canModifySettings = AuthService.hasPermission(PERMISSIONS.ADMIN_SETTINGS);

  const handleEnableAll = () => {
    if (!canModifySettings) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to modify settings.",
        variant: "destructive",
      });
      return;
    }

    onEnableAll();
    
    toast({
      title: "All Integrations Enabled",
      description: "All O365 integrations have been enabled successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleEnableAll} 
          className="w-full"
          disabled={!canModifySettings}
        >
          Enable All O365 Integrations
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickSetupCard;
