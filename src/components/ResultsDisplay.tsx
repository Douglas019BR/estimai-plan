import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Target, Users } from 'lucide-react';

interface Epic {
  name: string;
  description: string;
  priority: string;
  risk_factors: string[];
}

interface Task {
  id: string;
  name: string;
  description: string;
  epic: string;
  estimated_points: number;
  complexity: string;
  risk_level: string;
  dependencies: string[];
  considerations?: string;
}

interface Phase {
  name: string;
  tasks: string[];
  estimated_duration: string;
  deliverables: string[];
  critical_points: string[];
}

interface Milestone {
  name: string;
  date: string;
  deliverable: string;
}

interface ResultsDisplayProps {
  data: {
    refined_requirements?: {
      epics: Epic[];
    };
    risk_analysis?: {
      identified_risks: string[];
      mitigation_strategies: string[];
      impact_on_timeline: string;
    };
    tasks?: Task[];
    work_plan?: {
      phases: Phase[];
      total_estimated_points: number;
      estimated_duration: string;
      buffer_percentage: number;
      milestones: Milestone[];
    };
  };
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'alta': return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'média': return 'bg-warning/20 text-warning-foreground border-warning/30';
    case 'baixa': return 'bg-success/20 text-success-foreground border-success/30';
    default: return 'bg-muted/50 text-muted-foreground border-muted/30';
  }
};

const getComplexityColor = (complexity: string) => {
  switch (complexity?.toLowerCase()) {
    case 'alta': return 'bg-destructive/20 text-destructive';
    case 'média': return 'bg-warning/20 text-warning-foreground';
    case 'baixa': return 'bg-success/20 text-success-foreground';
    default: return 'bg-muted/50 text-muted-foreground';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case 'alto': return 'bg-destructive/20 text-destructive';
    case 'médio': return 'bg-warning/20 text-warning-foreground';
    case 'baixo': return 'bg-success/20 text-success-foreground';
    default: return 'bg-muted/50 text-muted-foreground';
  }
};

const ResultsDisplay = ({ data }: ResultsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Épicos Refinados */}
      {data.refined_requirements?.epics && (
        <Card className="lg:col-span-2 gradient-card shadow-card">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              📋 Épicos do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.refined_requirements.epics.map((epic, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4 bg-card/70 shadow-hover transition-all hover:shadow-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg">{epic.name}</h4>
                    <Badge className={getPriorityColor(epic.priority)}>
                      {epic.priority}
                    </Badge>
                  </div>
                  <p className="text-foreground/80 mb-3">{epic.description}</p>
                  {epic.risk_factors?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground/70 mb-1">Fatores de Risco:</p>
                      <div className="flex flex-wrap gap-1">
                        {epic.risk_factors.map((risk, riskIndex) => (
                          <Badge key={riskIndex} variant="outline" className="text-xs bg-background/80">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise de Riscos */}
      {data.risk_analysis && (
        <Card className="bg-secondary/10 border-secondary/20 shadow-card">
          <CardHeader className="border-b border-secondary/20">
            <CardTitle className="flex items-center gap-2">
              ⚠️ Análise de Riscos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h4 className="font-semibold mb-2">Riscos Identificados</h4>
              <ul className="space-y-1">
                {data.risk_analysis.identified_risks?.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Estratégias de Mitigação</h4>
              <ul className="space-y-1">
                {data.risk_analysis.mitigation_strategies?.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            {data.risk_analysis.impact_on_timeline && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1 text-yellow-800">Impacto no Cronograma</h4>
                <p className="text-sm text-yellow-700">{data.risk_analysis.impact_on_timeline}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plano de Trabalho */}
      {data.work_plan && (
        <Card className="bg-accent/10 border-accent/20 shadow-card">
          <CardHeader className="border-b border-accent/20">
            <CardTitle className="flex items-center gap-2">
              📅 Plano de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
              <div>
                <p className="text-sm text-accent">Total de Pontos</p>
                <p className="font-bold text-lg">{data.work_plan.total_estimated_points}</p>
              </div>
              <div>
                <p className="text-sm text-accent">Duração Estimada</p>
                <p className="font-bold text-lg">{data.work_plan.estimated_duration}</p>
              </div>
            </div>

            {data.work_plan.phases && (
              <div>
                <h4 className="font-semibold mb-2">Fases do Projeto</h4>
                <div className="space-y-2">
                  {data.work_plan.phases.map((phase, index) => (
                    <div key={index} className="border-l-4 border-accent pl-3 py-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{phase.name}</h5>
                        <Badge variant="outline" className="bg-accent/5 border-accent/30">{phase.estimated_duration}</Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mt-1">
                        {phase.deliverables?.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.work_plan.milestones && (
              <div>
                <h4 className="font-semibold mb-2">Marcos Importantes</h4>
                <div className="space-y-2">
                  {data.work_plan.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <Target className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{milestone.name}</p>
                        <p className="text-xs text-foreground/70">{milestone.date} - {milestone.deliverable}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tarefas Detalhadas */}
      {data.tasks && data.tasks.length > 0 && (
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              ✅ Tarefas Detalhadas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {data.tasks.map((task, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4 bg-card/70 shadow-hover transition-all hover:shadow-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{task.name}</h4>
                      <p className="text-sm text-foreground/70">{task.id} • {task.epic}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getComplexityColor(task.complexity)}>
                        {task.complexity}
                      </Badge>
                      <Badge className={getRiskColor(task.risk_level)}>
                        {task.risk_level}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-foreground/80 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span>{task.estimated_points} pontos</span>
                    </div>
                    
                    {task.dependencies?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-accent" />
                        <span>Depende de: {task.dependencies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.considerations && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                      <strong>Considerações:</strong> {task.considerations}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsDisplay;
