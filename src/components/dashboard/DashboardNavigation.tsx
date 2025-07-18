import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  ArrowRightLeft, 
  Building2, 
  Bot, 
  FileText,
  FileBarChart
} from 'lucide-react';

interface DashboardNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardNavigation = ({ activeTab, onTabChange }: DashboardNavigationProps) => {
  return (
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <PieChart className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="migration" className="flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Migration</span>
      </TabsTrigger>
      <TabsTrigger value="tenants" className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">Tenants</span>
      </TabsTrigger>
      <TabsTrigger value="auto-reports" className="flex items-center gap-2">
        <FileBarChart className="h-4 w-4" />
        <span className="hidden sm:inline">Auto Reports</span>
      </TabsTrigger>
      <TabsTrigger value="ai-tools" className="flex items-center gap-2">
        <Bot className="h-4 w-4" />
        <span className="hidden sm:inline">AI Tools</span>
      </TabsTrigger>
      <TabsTrigger value="reports" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Reports</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardNavigation;