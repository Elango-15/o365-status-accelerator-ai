
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertTriangle, FileText, Users, Shield, Database, Settings, TrendingUp } from 'lucide-react';

interface MigrationPhase {
  id: string;
  phase: string;
  description: string;
  tools: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  icon: any;
}

const migrationPhases: MigrationPhase[] = [
  {
    id: 'initiation',
    phase: 'Initiation',
    description: 'Define business goals and scope for O365 Accelerator. Identify stakeholders and project owners.',
    tools: 'Project Charter, Kick-off PPT',
    status: 'completed',
    progress: 100,
    icon: FileText
  },
  {
    id: 'assessment',
    phase: 'Assessment',
    description: 'Assess existing environment (AD, Exchange, File shares, etc.) and readiness for O365 migration.',
    tools: 'Microsoft Assessment Tool, FastTrack Readiness, MAP Toolkit',
    status: 'completed',
    progress: 100,
    icon: Shield
  },
  {
    id: 'design',
    phase: 'Design',
    description: 'Plan architecture, identify workloads (e.g., Exchange Online, SharePoint, Teams), define identity strategy (cloud-only, hybrid).',
    tools: 'Architecture Diagrams, Microsoft 365 Roadmap',
    status: 'in-progress',
    progress: 75,
    icon: Settings
  },
  {
    id: 'identity-access',
    phase: 'Identity & Access Setup',
    description: 'Implement or integrate Azure AD. Set up SSO, MFA, Conditional Access, and user provisioning.',
    tools: 'Azure AD Connect, ADFS, Security Defaults',
    status: 'in-progress',
    progress: 60,
    icon: Users
  },
  {
    id: 'tenant-config',
    phase: 'Tenant Configuration',
    description: 'Configure O365 tenant settings, security defaults, branding, domains, licenses, etc.',
    tools: 'M365 Admin Center, PowerShell',
    status: 'not-started',
    progress: 0,
    icon: Database
  },
  {
    id: 'workload-enablement',
    phase: 'Workload Enablement',
    description: 'Set up core services: Exchange Online, OneDrive, Teams, SharePoint. Configure policies and sharing settings.',
    tools: 'Admin Centers, Compliance Portal',
    status: 'not-started',
    progress: 0,
    icon: Settings
  },
  {
    id: 'security-compliance',
    phase: 'Security & Compliance',
    description: 'Enable DLP, sensitivity labels, retention, Microsoft Defender, audit logging, compliance manager.',
    tools: 'Purview, Defender for M365, Secure Score',
    status: 'not-started',
    progress: 0,
    icon: Shield
  },
  {
    id: 'migration-planning',
    phase: 'Migration Planning',
    description: 'Plan for mailbox migration, file share to OneDrive/SharePoint, and Teams chat/channel migration.',
    tools: 'Migration tools: Quest, BitTitan, native M365 tools',
    status: 'not-started',
    progress: 0,
    icon: Database
  },
  {
    id: 'pilot-deployment',
    phase: 'Pilot Deployment',
    description: 'Migrate a small group (pilot users), validate functionality, gather feedback.',
    tools: 'Monitor logs and performance',
    status: 'not-started',
    progress: 0,
    icon: Users
  },
  {
    id: 'full-rollout',
    phase: 'Full Rollout',
    description: 'Migrate full workloads, onboard users, provide training, finalize handover.',
    tools: 'Training material, user support',
    status: 'not-started',
    progress: 0,
    icon: TrendingUp
  },
  {
    id: 'adoption-optimization',
    phase: 'Adoption & Optimization',
    description: 'Monitor usage, promote adoption, optimize configurations, and plan for future enhancements.',
    tools: 'Power BI Reports, Adoption Score, Microsoft Viva',
    status: 'not-started',
    progress: 0,
    icon: TrendingUp
  }
];

const MigrationPhasesSection = () => {
  const [phases, setPhases] = useState(migrationPhases);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': { variant: 'default' as const, label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
      'in-progress': { variant: 'default' as const, label: 'In Progress', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'blocked': { variant: 'destructive' as const, label: 'Blocked', className: 'bg-red-100 text-red-800 border-red-200' },
      'not-started': { variant: 'secondary' as const, label: 'Not Started', className: 'bg-gray-100 text-gray-700 border-gray-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const updatePhaseStatus = (phaseId: string, newStatus: string) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? { 
            ...phase, 
            status: newStatus as any,
            progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 50 : 0
          }
        : phase
    ));
  };

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const totalPhases = phases.length;
  const overallProgress = (completedPhases / totalPhases) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            O365 Migration Accelerator Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{completedPhases}/{totalPhases} phases completed</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedPhases}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {phases.filter(p => p.status === 'in-progress').length}
                </div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {phases.filter(p => p.status === 'not-started').length}
                </div>
                <div className="text-xs text-gray-500">Not Started</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {phases.filter(p => p.status === 'blocked').length}
                </div>
                <div className="text-xs text-gray-500">Blocked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Phases */}
      <div className="grid gap-4">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <Card key={phase.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(phase.status)}
                        <h3 className="font-semibold text-lg">{phase.phase}</h3>
                        {getStatusBadge(phase.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePhaseStatus(phase.id, 'in-progress')}
                          disabled={phase.status === 'in-progress'}
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updatePhaseStatus(phase.id, 'completed')}
                          disabled={phase.status === 'completed'}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600">{phase.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tools: </span>
                        <span className="text-gray-600">{phase.tools}</span>
                      </div>
                    </div>
                    {phase.status === 'in-progress' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MigrationPhasesSection;
