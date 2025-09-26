import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EstimInput = () => {
  const [requirements, setRequirements] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requirements.trim()) {
      toast({
        title: "Requisitos obrigatórios",
        description: "Por favor, descreva os requisitos do sistema.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/estimate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requirements: requirements.trim(),
            additional_info: additionalInfo.trim()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const responseId = data.id || data.request_id;
        
        navigate(`/results/${responseId}`, { 
          state: { 
            responseId, 
            requirements, 
            additionalInfo 
          } 
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const responseId = `estim_${Date.now()}`;
        
        navigate(`/results/${responseId}`, { 
          state: { 
            responseId, 
            requirements, 
            additionalInfo 
          } 
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Erro na estimativa",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              estimAI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Transforme seus requisitos em estimativas precisas com IA
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Descreva seu projeto</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Requirements Input */}
              <div className="space-y-3">
                <label htmlFor="requirements" className="text-sm font-medium text-foreground">
                  Requisitos do Sistema *
                </label>
                <Textarea
                  id="requirements"
                  placeholder="Descreva detalhadamente os requisitos do seu sistema: funcionalidades, tecnologias, integrações necessárias..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-[150px] resize-none bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>

              {/* Additional Info Input */}
              <div className="space-y-3">
                <label htmlFor="additionalInfo" className="text-sm font-medium text-foreground">
                  Informações Adicionais
                </label>
                <Input
                  id="additionalInfo"
                  placeholder="Prazos, orçamento, equipe, restrições técnicas..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !requirements.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button px-8 py-3 text-lg font-semibold group transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Gerar Estimativa
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstimInput;