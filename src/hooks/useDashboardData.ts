
import { useState } from 'react';
import { BarChart3, Users, CheckCircle, Clock } from 'lucide-react';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    productivityData: [
      { name: 'Mon', tasks: 12, completed: 10 },
      { name: 'Tue', tasks: 15, completed: 13 },
      { name: 'Wed', tasks: 18, completed: 16 },
      { name: 'Thu', tasks: 14, completed: 12 },
      { name: 'Fri', tasks: 20, completed: 18 },
    ],
    statusData: [
      { name: 'Completed', value: 65, color: '#10b981' },
      { name: 'In Progress', value: 25, color: '#3b82f6' },
      { name: 'Pending', value: 10, color: '#f59e0b' },
    ],
    teamMetrics: [
      { metric: 'Active Projects', value: '24', change: '+12%', trend: 'up', icon: BarChart3 },
      { metric: 'Team Members', value: '156', change: '+8%', trend: 'up', icon: Users },
      { metric: 'Completion Rate', value: '87%', change: '+5%', trend: 'up', icon: CheckCircle },
      { metric: 'Avg Response Time', value: '2.3h', change: '-15%', trend: 'up', icon: Clock },
    ]
  });

  return {
    dashboardData,
    setDashboardData
  };
};
