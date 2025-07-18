import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface LiveDataMetrics {
  totalConnections: number;
  activeConnections: number;
  dataPointsPerSecond: number;
  averageLatency: number;
  errorRate: number;
  uptime: number;
  lastUpdate: string;
}

export interface ConnectionHealth {
  microsoftGraph: 'healthy' | 'degraded' | 'down';
  sharePoint: 'healthy' | 'degraded' | 'down';
  teams: 'healthy' | 'degraded' | 'down';
  exchange: 'healthy' | 'degraded' | 'down';
  azureAD: 'healthy' | 'degraded' | 'down';
  powerBI: 'healthy' | 'degraded' | 'down';
}

export const useLiveDataStatus = () => {
  const { toast } = useToast();
  
  const [metrics, setMetrics] = useState<LiveDataMetrics>({
    totalConnections: 6,
    activeConnections: 4,
    dataPointsPerSecond: 12.5,
    averageLatency: 245,
    errorRate: 0.02,
    uptime: 99.8,
    lastUpdate: new Date().toISOString()
  });

  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth>({
    microsoftGraph: 'healthy',
    sharePoint: 'healthy',
    teams: 'degraded',
    exchange: 'down',
    azureAD: 'healthy',
    powerBI: 'degraded'
  });

  const [isMonitoring, setIsMonitoring] = useState(true);

  // Real-time metrics updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      updateMetrics();
      checkConnectionHealth();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const updateMetrics = () => {
    setMetrics(prev => {
      const activeConnections = Object.values(connectionHealth).filter(status => status === 'healthy').length;
      
      return {
        ...prev,
        activeConnections,
        dataPointsPerSecond: prev.dataPointsPerSecond + (Math.random() - 0.5) * 2,
        averageLatency: Math.max(100, prev.averageLatency + (Math.random() - 0.5) * 50),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        uptime: Math.min(100, prev.uptime + (Math.random() - 0.3) * 0.1),
        lastUpdate: new Date().toISOString()
      };
    });
  };

  const checkConnectionHealth = () => {
    setConnectionHealth(prev => {
      const newHealth = { ...prev };
      
      // Simulate health changes
      Object.keys(newHealth).forEach(service => {
        const currentStatus = newHealth[service as keyof ConnectionHealth];
        const rand = Math.random();
        
        if (currentStatus === 'healthy' && rand < 0.05) {
          newHealth[service as keyof ConnectionHealth] = 'degraded';
        } else if (currentStatus === 'degraded') {
          if (rand < 0.3) {
            newHealth[service as keyof ConnectionHealth] = 'healthy';
          } else if (rand < 0.1) {
            newHealth[service as keyof ConnectionHealth] = 'down';
          }
        } else if (currentStatus === 'down' && rand < 0.2) {
          newHealth[service as keyof ConnectionHealth] = 'degraded';
        }
      });

      // Check for status changes and notify
      Object.keys(newHealth).forEach(service => {
        const oldStatus = prev[service as keyof ConnectionHealth];
        const newStatus = newHealth[service as keyof ConnectionHealth];
        
        if (oldStatus !== newStatus) {
          const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
          
          if (newStatus === 'down') {
            toast({
              title: `${serviceName} Connection Lost`,
              description: `Connection to ${serviceName} has been lost. Attempting to reconnect...`,
              variant: "destructive",
            });
          } else if (newStatus === 'healthy' && oldStatus === 'down') {
            toast({
              title: `${serviceName} Reconnected`,
              description: `Connection to ${serviceName} has been restored.`,
            });
          }
        }
      });

      return newHealth;
    });
  };

  const getOverallHealth = (): 'healthy' | 'degraded' | 'critical' => {
    const healthValues = Object.values(connectionHealth);
    const healthyCount = healthValues.filter(status => status === 'healthy').length;
    const downCount = healthValues.filter(status => status === 'down').length;
    
    if (downCount > 2) return 'critical';
    if (healthyCount < 3) return 'degraded';
    return 'healthy';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'down': case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoring Paused" : "Monitoring Resumed",
      description: isMonitoring 
        ? "Real-time monitoring has been paused."
        : "Real-time monitoring has been resumed.",
    });
  };

  const resetMetrics = () => {
    setMetrics({
      totalConnections: 6,
      activeConnections: 4,
      dataPointsPerSecond: 12.5,
      averageLatency: 245,
      errorRate: 0.02,
      uptime: 99.8,
      lastUpdate: new Date().toISOString()
    });

    setConnectionHealth({
      microsoftGraph: 'healthy',
      sharePoint: 'healthy',
      teams: 'degraded',
      exchange: 'down',
      azureAD: 'healthy',
      powerBI: 'degraded'
    });

    toast({
      title: "Metrics Reset",
      description: "All monitoring metrics have been reset to default values.",
    });
  };

  return {
    metrics,
    connectionHealth,
    isMonitoring,
    getOverallHealth,
    getHealthColor,
    getHealthBadgeColor,
    toggleMonitoring,
    resetMetrics,
    updateMetrics,
    checkConnectionHealth
  };
};