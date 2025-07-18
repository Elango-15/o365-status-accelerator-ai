
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, FileText, TrendingUp, Zap } from 'lucide-react';

const AIToolsSection = () => {
  const tools = [
    { 
      title: 'AI Analytics', 
      description: 'Get AI-powered insights into your team\'s productivity patterns and performance metrics',
      icon: Brain,
      action: 'Generate Insights',
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      title: 'Document Assistant', 
      description: 'AI-powered document summarization, analysis, and content generation',
      icon: FileText,
      action: 'Analyze Documents',
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      title: 'Predictive Analytics', 
      description: 'Forecast project completion dates and resource allocation needs',
      icon: TrendingUp,
      action: 'Run Predictions',
      color: 'bg-green-50 border-green-200'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className={`bg-white shadow-sm border-0 ${tool.color}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <tool.icon className="h-6 w-6 text-primary" />
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                {tool.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Configuration */}
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">AI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">AI Model Selection</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>GPT-4 (Recommended)</option>
                  <option>GPT-3.5 Turbo</option>
                  <option>Claude</option>
                  <option>Gemini</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Analysis Frequency</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <Button>Save AI Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIToolsSection;
