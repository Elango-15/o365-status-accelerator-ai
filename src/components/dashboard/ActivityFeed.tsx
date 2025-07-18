
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Calendar, FileText, Users } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    { action: 'Project Alpha successfully completed', time: '2 hours ago', status: 'completed', icon: CheckCircle },
    { action: 'Team meeting scheduled for next week', time: '4 hours ago', status: 'pending', icon: Calendar },
    { action: 'Quarterly report generated and distributed', time: '6 hours ago', status: 'completed', icon: FileText },
    { action: 'New team member onboarded', time: '1 day ago', status: 'completed', icon: Users },
  ];

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <activity.icon className={`h-5 w-5 flex-shrink-0 ${
                activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="flex-shrink-0">
                {activity.status === 'completed' ? 'Complete' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
