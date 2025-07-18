
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricData {
  metric: string;
  value: string;
  change: string;
  trend: string;
  icon: LucideIcon;
}

interface KPICardsProps {
  metrics: MetricData[];
}

const KPICards = ({ metrics }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{metric.metric}</CardTitle>
            <metric.icon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <p className="text-sm flex items-center gap-1">
              <span className="text-green-600 font-medium">
                {metric.change}
              </span>
              <span className="text-gray-500">from last period</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
