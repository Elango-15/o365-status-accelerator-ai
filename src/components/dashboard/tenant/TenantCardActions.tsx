
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, TestTube, Trash2 } from 'lucide-react';
import { Tenant } from '@/types/tenant';

interface TenantCardActionsProps {
  tenant: Tenant;
  loading: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onTestConnection: () => void;
  onDelete: () => void;
}

const TenantCardActions: React.FC<TenantCardActionsProps> = ({
  tenant,
  loading,
  onEnable,
  onDisable,
  onTestConnection,
  onDelete
}) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t">
      {tenant.isEnabled ? (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onDisable}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Square className="h-3 w-3 mr-1" />
          Disable
        </Button>
      ) : (
        <Button 
          size="sm" 
          onClick={onEnable}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="h-3 w-3 mr-1" />
          Enable
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onTestConnection}
        disabled={loading || !tenant.isEnabled}
      >
        <TestTube className="h-3 w-3 mr-1" />
        {loading ? 'Testing...' : 'Test'}
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  );
};

export default TenantCardActions;
