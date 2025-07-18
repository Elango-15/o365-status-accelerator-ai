
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tenant } from '@/hooks/useTenantManagement';

interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
}

const AddTenantDialog: React.FC<AddTenantDialogProps> = ({
  open,
  onOpenChange,
  onAddTenant
}) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    tenantId: '',
    clientId: '',
    adminEmail: '',
    userCount: '',
    licenseCount: '',
    status: 'pending' as const
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.domain || !formData.tenantId || !formData.clientId || !formData.adminEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(formData.domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., company.com).",
        variant: "destructive",
      });
      return;
    }

    const newTenant: Omit<Tenant, 'id' | 'createdAt'> = {
      name: formData.name,
      domain: formData.domain,
      tenantId: formData.tenantId || 'ad5cd7c6-bcb2-4a2d-9106-28df885282df',
      clientId: formData.clientId || '096e13b5-7874-4827-ba5a-0006f1e1fd0d',
      adminEmail: formData.adminEmail,
      isEnabled: false,
      isConnected: false,
      userCount: parseInt(formData.userCount) || 0,
      licenseCount: parseInt(formData.licenseCount) || 0,
      status: formData.status
    };

    onAddTenant(newTenant);
    
    // Reset form
    setFormData({
      name: '',
      domain: '',
      tenantId: '',
      clientId: '',
      adminEmail: '',
      userCount: '',
      licenseCount: '',
      status: 'pending'
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              placeholder="CD"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              placeholder="cdtech.cloud"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tenantId">Azure AD Tenant ID *</Label>
            <Input
              id="tenantId"
              placeholder="ad5cd7c6-bcb2-4a2d-9106-28df885282df"
              defaultValue="ad5cd7c6-bcb2-4a2d-9106-28df885282df"
              value={formData.tenantId}
              onChange={(e) => handleInputChange('tenantId', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Application Client ID *</Label>
            <Input
              id="clientId"
              placeholder="096e13b5-7874-4827-ba5a-0006f1e1fd0d"
              defaultValue="096e13b5-7874-4827-ba5a-0006f1e1fd0d"
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Using your configured tenant credentials</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="elango@cdtech.cloud"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userCount">User Count</Label>
              <Input
                id="userCount"
                type="number"
                placeholder="0"
                value={formData.userCount}
                onChange={(e) => handleInputChange('userCount', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseCount">License Count</Label>
              <Input
                id="licenseCount"
                type="number"
                placeholder="0"
                value={formData.licenseCount}
                onChange={(e) => handleInputChange('licenseCount', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Tenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
