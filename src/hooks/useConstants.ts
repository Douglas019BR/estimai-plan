import { COLORS, TEXTS, LAYOUT, ANIMATIONS, BREAKPOINTS, API, ROUTES } from '@/constants';

/**
 * Hook para acessar todas as constantes do projeto de forma tipada
 */
export const useConstants = () => {
  return {
    colors: COLORS,
    texts: TEXTS,
    layout: LAYOUT,
    animations: ANIMATIONS,
    breakpoints: BREAKPOINTS,
    api: API,
    routes: ROUTES,
  } as const;
};

/**
 * Hook específico para textos (mais comum)
 */
export const useTexts = () => TEXTS;

/**
 * Hook específico para cores (se necessário em JS)
 */
export const useColors = () => COLORS;

/**
 * Hook para rotas
 */
export const useRoutes = () => ROUTES;
