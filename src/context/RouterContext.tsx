import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Router mínimo basado en hash (#/ruta). Evita configurar reescrituras en el
 * servidor y funciona en cualquier hosting estático.
 *
 * Algunas rutas apuntan a secciones de la página de producto
 * (p. ej. #/preguntas-frecuentes) y hacen scroll a esa sección.
 */

export const SECTION_ROUTES: Record<string, string> = {
  '/preguntas-frecuentes': 'faq',
  '/opiniones': 'reviews',
  '/comprar': 'product',
};

function readPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
}

interface RouterValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.getElementById('site-header');
  const offset = (header?.getBoundingClientRect().height ?? 0) + 12;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onHash = () => setPath(readPath());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Al cambiar de ruta: scroll a la sección indicada o al inicio.
  useEffect(() => {
    const section = SECTION_ROUTES[path];
    if (section) {
      // Espera a que la página de producto esté montada.
      const id = window.setTimeout(() => scrollToSection(section), 60);
      return () => window.clearTimeout(id);
    }
    window.scrollTo({ top: 0 });
  }, [path]);

  const navigate = useCallback((to: string) => {
    if (readPath() === to) {
      const section = SECTION_ROUTES[to];
      if (section) scrollToSection(section);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = to;
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter debe usarse dentro de <RouterProvider>');
  return ctx;
}
