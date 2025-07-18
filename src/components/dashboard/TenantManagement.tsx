
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Users, Activity } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import TenantCard from './TenantCard';
import AddTenantDialog from './AddTenantDialog';
import { Progress } from '@/components/ui/progress';

const TenantManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { tenants, loading, addTenant, enableTenant, disableTenant, testConnection, deleteTenant } = useTenantManagement();

  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const connectedTenants = tenants.filter(t => t.isConnected).length;
  const totalUsers = tenants.reduce((sum, t) => sum + (t.userCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                <p className="text-3xl font-bold text-gray-900">{tenants.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-3xl font-bold text-green-600">{activeTenants}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-3xl font-bold text-blue-600">{connectedTenants}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Configuration Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Activity className="h-5 w-5" />
            Real-time Tenant Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Configuration Progress</span>
                <span className="font-semibold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-600">Auto-sync enabled for active tenants</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{connectedTenants}</div>
                <div className="text-sm text-blue-600">Live Connections</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-600">Synced Users</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tenant Management Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Tenant Management</CardTitle>
              <p className="text-gray-600 mt-1">Manage and monitor your O365 tenant connections</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tenant List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            loading={loading}
            onEnable={() => enableTenant(tenant.id)}
            onDisable={() => disableTenant(tenant.id)}
            onTestConnection={() => testConnection(tenant.id)}
            onDelete={() => deleteTenant(tenant.id)}
          />
        ))}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tenants Added</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first O365 tenant.</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Tenant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Tenant Dialog */}
      <AddTenantDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddTenant={addTenant}
      />
    </div>
  );
};

export default TenantManagement;
