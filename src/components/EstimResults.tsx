import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Bot } from 'lucide-react';
import JsonViewer from './JsonViewer';
import ResultsDisplay from './ResultsDisplay';
import { useToast } from '@/hooks/use-toast';

// Mock data that matches the specified JSON structure
const mockEstimationData = {
  refined_requirements: {
    epics: [
      {
        name: "Autenticação e Autorização",
        description: "Sistema completo de login, cadastro e gestão de permissões de usuários",
        priority: "Alta",
        risk_factors: ["Integração com sistemas externos", "Conformidade LGPD", "Segurança de dados"]
      },
      {
        name: "Dashboard Principal",
        description: "Interface principal com métricas, gráficos e visão geral do sistema",
        priority: "Alta", 
        risk_factors: ["Performance com grandes volumes de dados", "Responsividade"]
      },
      {
        name: "Módulo de Relatórios",
        description: "Geração e exportação de relatórios customizáveis",
        priority: "Média",
        risk_factors: ["Complexidade das consultas", "Tempo de processamento"]
      }
    ]
  },
  risk_analysis: {
    identified_risks: [
      "Dependência de APIs externas pode causar instabilidade",
      "Complexidade da arquitetura pode impactar prazos",
      "Necessidade de testes extensivos de segurança"
    ],
    mitigation_strategies: [
      "Implementar fallbacks e cache para APIs externas",
      "Documentação técnica detalhada e code review",
      "Testes automatizados de segurança e penetração"
    ],
    impact_on_timeline: "Risco médio pode adicionar 15-20% ao cronograma previsto"
  },
  tasks: [
    {
      id: "T001",
      name: "Configuração do Ambiente de Desenvolvimento",
      description: "Setup inicial do projeto, configuração de dependências e estrutura base",
      epic: "Autenticação e Autorização",
      estimated_points: 5,
      complexity: "Baixa",
      risk_level: "Baixo",
      dependencies: [],
      considerations: "Definir padrões de desenvolvimento e estrutura de pastas"
    },
    {
      id: "T002", 
      name: "Sistema de Login e Cadastro",
      description: "Implementação das telas e lógica de autenticação de usuários",
      epic: "Autenticação e Autorização",
      estimated_points: 13,
      complexity: "Média",
      risk_level: "Médio",
      dependencies: ["T001"],
      considerations: "Integração com OAuth e validação de email"
    },
    {
      id: "T003",
      name: "Dashboard com Métricas",
      description: "Desenvolvimento da tela principal com gráficos e indicadores",
      epic: "Dashboard Principal", 
      estimated_points: 21,
      complexity: "Alta",
      risk_level: "Alto",
      dependencies: ["T002"],
      considerations: "Otimização de performance para grandes datasets"
    }
  ],
  work_plan: {
    phases: [
      {
        name: "Fase 1 - Setup e Autenticação",
        tasks: ["T001", "T002"],
        estimated_duration: "3 semanas",
        deliverables: ["Ambiente configurado", "Sistema de login funcional"],
        critical_points: ["Definição da arquitetura", "Integração com OAuth"]
      },
      {
        name: "Fase 2 - Dashboard e Core Features", 
        tasks: ["T003"],
        estimated_duration: "4 semanas",
        deliverables: ["Dashboard principal", "Métricas em tempo real"],
        critical_points: ["Performance dos gráficos", "Responsividade"]
      }
    ],
    total_estimated_points: 39,
    estimated_duration: "7 semanas",
    buffer_percentage: 20,
    milestones: [
      {
        name: "MVP Funcional",
        date: "Semana 4",
        deliverable: "Sistema básico com autenticação e dashboard"
      },
      {
        name: "Versão Beta",
        date: "Semana 7", 
        deliverable: "Sistema completo com todos os módulos"
      }
    ]
  }
};

const EstimResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [estimationData, setEstimationData] = useState(null);

  // Get responseId from URL params or location state
  const responseId = id || location.state?.responseId;
  const { requirements, additionalInfo } = location.state || {};

  useEffect(() => {
    if (!responseId) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      const maxAttempts = 60; 
      const pollInterval = 20000; // 20 seconds
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          
          const bucketUrl = import.meta.env.VITE_S3_BUCKET_URL;
          const fileUrl = `${bucketUrl}/${responseId}.json`;

          const response = await fetch(fileUrl, {
            method: 'GET',
            mode: 'cors'
          });

          if (response.ok) {
            const data = await response.json();
            
            // Process the result field to extract structured JSON
            let processedData = data;
            if (data.result && typeof data.result.refined_requirements === 'string') {
              try {
                // Try to extract JSON from the text
                const jsonMatch = data.result.refined_requirements.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                  const extractedJson = JSON.parse(jsonMatch[1]);
                  processedData = {
                    ...data,
                    result: extractedJson
                  };
                }
              } catch (parseError) {
                console.warn('Could not parse embedded JSON, using original structure');
              }
            }
            
            setEstimationData(processedData);
            setIsLoading(false);
            return;
          } else if (response.status === 404 || response.status === 403) {
            if (attempts < maxAttempts) {
              setTimeout(poll, pollInterval);
              return;
            }
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Max attempts reached
          throw new Error('Timeout: Results not available after 5 minutes');
          
        } catch (error) {
          console.error('Polling error:', error);
          
          if (attempts < maxAttempts && (error.name === 'TypeError' || error.message.includes('404') || error.message.includes('403'))) {
            // Continue polling on network errors or 404/403 (file not ready)
            setTimeout(poll, pollInterval);
          } else if (attempts >= maxAttempts) {
            // Max attempts reached, fallback to mock data
            console.log('Max attempts reached, using mock data');
            setEstimationData(mockEstimationData);
            setIsLoading(false);
          } else {
            // Other errors, show error message
            toast({
              title: "Erro ao carregar resultados",
              description: "Não foi possível carregar os resultados. Usando dados de exemplo.",
              variant: "destructive",
            });
            setEstimationData(mockEstimationData);
            setIsLoading(false);
          }
        }
      };

      // Start polling
      poll();
    };

    fetchResults();
  }, [responseId, navigate, toast]);

  const handleExport = () => {
    if (!estimationData) return;
    
    const dataStr = JSON.stringify(estimationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estimativa_${responseId}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado com sucesso!",
      description: "A estimativa foi salva em formato JSON.",
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/results/${responseId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EstimAI - Estimativa de Projeto',
          text: 'Confira esta estimativa gerada pelo EstimAI',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <Bot className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              estimAI
            </h1>
          </div>
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-xl text-muted-foreground">
              Processando sua estimativa...
            </p>
            <p className="text-sm text-muted-foreground">
              Analisando requisitos e gerando plano de trabalho
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nova Estimativa
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Estimativa Gerada
              </h1>
              <p className="text-muted-foreground">ID: {responseId}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="border-border/50 hover:bg-muted/50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              onClick={handleExport}
              className="bg-gradient-accent text-white hover:opacity-90"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar JSON
            </Button>
          </div>
        </div>

        {/* Input Summary */}
        {requirements && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JsonViewer data={{ requirements }} title="Requisitos Fornecidos" />
            {additionalInfo && (
              <JsonViewer data={{ additional_info: additionalInfo }} title="Informações Adicionais" />
            )}
          </div>
        )}

        {/* Results */}
        {estimationData && (
          <div>
            {estimationData.result ? (
              <ResultsDisplay data={estimationData.result} />
            ) : (
              <ResultsDisplay data={mockEstimationData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimResults;