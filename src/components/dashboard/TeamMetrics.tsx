
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductivityData {
  name: string;
  tasks: number;
  completed: number;
}

interface TeamMetricsProps {
  productivityData: ProductivityData[];
}

const TeamMetrics = ({ productivityData }: TeamMetricsProps) => {
  const teamData = [
    { team: 'Development', progress: 85, members: 12, color: '#3b82f6' },
    { team: 'Marketing', progress: 92, members: 8, color: '#10b981' },
    { team: 'Sales', progress: 78, members: 15, color: '#f59e0b' },
    { team: 'Support', progress: 96, members: 6, color: '#8b5cf6' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Team Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {teamData.map((team, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{team.team}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{team.members} members</span>
                  <span className="text-sm font-medium text-gray-900">{team.progress}%</span>
                </div>
              </div>
              <Progress value={team.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMetrics;
