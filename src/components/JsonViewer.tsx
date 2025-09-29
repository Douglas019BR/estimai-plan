import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface JsonViewerProps {
  data: Record<string, unknown>;
  title?: string;
}

const JsonViewer = ({ data, title }: JsonViewerProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "JSON copiado para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o JSON",
        variant: "destructive",
      });
    }
  };

  const renderValue = (value: any, path: string, key?: string): JSX.Element => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-accent font-medium">{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-secondary font-medium">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-primary">&quot;{value}&quot;</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedNodes.has(path);
      return (
        <div>
          <button
            onClick={() => toggleNode(path)}
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-muted-foreground">[{value.length} items]</span>
          </button>
          {isExpanded && (
            <div className="ml-6 mt-2 space-y-2 border-l border-border/30 pl-4">
              {value.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground text-sm">{index}:</span>
                  {renderValue(item, `${path}[${index}]`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedNodes.has(path);
      const keys = Object.keys(value);
      
      return (
        <div>
          <button
            onClick={() => toggleNode(path)}
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-muted-foreground">{`{${keys.length} properties}`}</span>
          </button>
          {isExpanded && (
            <div className="ml-6 mt-2 space-y-3 border-l border-border/30 pl-4">
              {keys.map((objKey) => (
                <div key={objKey} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-accent font-medium">{objKey}:</span>
                  </div>
                  <div className="ml-4">
                    {renderValue(value[objKey], `${path}.${objKey}`, objKey)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-foreground">{String(value)}</span>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'bg-destructive text-destructive-foreground';
      case 'média': return 'bg-amber-500 text-white';
      case 'baixa': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'alto': return 'bg-destructive text-destructive-foreground';
      case 'médio': return 'bg-amber-500 text-white';
      case 'baixo': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title || 'Dados JSON'}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="border-border/50 hover:bg-muted/50"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-sm space-y-2">
          {renderValue(data, 'root')}
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonViewer;