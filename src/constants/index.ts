// EstimAI - Constantes Centralizadas

// CORES DO PROJETO (HSL values)
export const COLORS = {
  // Cores principais
  background: '235 62% 26%', // #1e1e68
  foreground: '0 0% 100%',   // white
  
  // Cores de destaque
  primary: '162 100% 46%',    // #00E991 verde
  secondary: '197 100% 50%',  // #00c9ff azul claro
  accent: '210 100% 50%',     // #0092ff azul
  purple: '258 100% 26%',     // #360084 roxo
  
  // Cores de interface
  card: '235 62% 30%',
  border: '235 62% 40%',
  input: '235 62% 35%',
  muted: '235 62% 35%',
  
  // Estados
  destructive: '0 84.2% 60.2%',
  success: '162 100% 46%',
  warning: '45 100% 60%',
} as const;

// TEXTOS E LABELS
export const TEXTS = {
  app: {
    name: 'EstimAI',
    tagline: 'Estimativas inteligentes para seus projetos',
  },
  
  navigation: {
    home: 'Início',
    results: 'Resultados',
    back: 'Voltar',
  },
  
  forms: {
    requirements: 'Requisitos do Sistema',
    additionalInfo: 'Informações Adicionais',
    submit: 'Gerar Estimativa',
    loading: 'Processando...',
  },
  
  messages: {
    requiredField: 'Este campo é obrigatório',
    processingError: 'Erro ao processar solicitação',
    success: 'Estimativa gerada com sucesso',
  },
} as const;

// CONFIGURAÇÕES DE LAYOUT
export const LAYOUT = {
  container: {
    maxWidth: '1400px',
    padding: '2rem',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
} as const;

// ANIMAÇÕES E TRANSIÇÕES
export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// BREAKPOINTS RESPONSIVOS
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// CONFIGURAÇÕES DA API
export const API = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3,
} as const;

// ROTAS DA APLICAÇÃO
export const ROUTES = {
  home: '/',
  results: '/results',
  notFound: '*',
} as const;
