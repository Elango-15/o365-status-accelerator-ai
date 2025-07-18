
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Eye, Clock } from 'lucide-react';
import { ENV_CONFIG, validateEnvironment } from '@/utils/environmentConfig';
import { AuthService } from '@/utils/authUtils';

interface SecurityEvent {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

const SecurityMonitor = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [environmentStatus, setEnvironmentStatus] = useState<{ valid: boolean; missing: string[] }>({ valid: true, missing: [] });

  useEffect(() => {
    // Check environment configuration
    const envStatus = validateEnvironment();
    setEnvironmentStatus(envStatus);

    // Add security events based on configuration
    const events: SecurityEvent[] = [];

    if (!envStatus.valid) {
      events.push({
        id: 'env-missing',
        type: 'warning',
        message: `Missing environment variables: ${envStatus.missing.join(', ')}`,
        timestamp: new Date()
      });
    }

    if (!AuthService.isAuthenticated()) {
      events.push({
        id: 'no-auth',
        type: 'info',
        message: 'User authentication not implemented',
        timestamp: new Date()
      });
    }

    if (ENV_CONFIG.IS_DEVELOPMENT) {
      events.push({
        id: 'dev-mode',
        type: 'info',
        message: 'Application running in development mode',
        timestamp: new Date()
      });
    }

    setSecurityEvents(events);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Eye className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Environment Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${environmentStatus.valid ? 'text-green-500' : 'text-yellow-500'}`} />
              <span>Environment Configuration</span>
            </div>
            <Badge variant={environmentStatus.valid ? "default" : "secondary"}>
              {environmentStatus.valid ? "Secure" : "Needs Attention"}
            </Badge>
          </div>

          {/* Security Events */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Security Events
            </h4>
            {securityEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No security events to display</p>
            ) : (
              <div className="space-y-2">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="text-sm">{event.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getEventBadge(event.type)}
                      <span className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;
