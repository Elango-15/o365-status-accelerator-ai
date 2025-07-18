
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { Tenant } from '@/types/tenant';
import { useToast } from '@/hooks/use-toast';

interface TenantCardDetailsProps {
  tenant: Tenant;
}

const TenantCardDetails: React.FC<TenantCardDetailsProps> = ({ tenant }) => {
  const { toast } = useToast();

  const copyTenantId = () => {
    navigator.clipboard.writeText(tenant.tenantId);
    toast({
      title: "Copied",
      description: "Tenant ID copied to clipboard",
    });
  };

  const copyClientId = () => {
    navigator.clipboard.writeText(tenant.clientId);
    toast({
      title: "Copied",
      description: "Client ID copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Admin Email:</span>
        <p className="font-medium truncate">{tenant.adminEmail}</p>
      </div>
      
      {/* Real-time Tenant ID Display */}
      <div>
        <span className="text-gray-600 flex items-center gap-2">
          Tenant ID:
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-gray-100"
            onClick={copyTenantId}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </span>
        <div className="bg-gray-50 p-2 rounded border font-mono text-xs break-all">
          {tenant.tenantId}
        </div>
      </div>

      {/* Real-time Client ID Display */}
      <div>
        <span className="text-gray-600 flex items-center gap-2">
          Client ID:
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-gray-100"
            onClick={copyClientId}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </span>
        <div className="bg-gray-50 p-2 rounded border font-mono text-xs break-all">
          {tenant.clientId}
        </div>
      </div>
    </div>
  );
};

export default TenantCardDetails;
