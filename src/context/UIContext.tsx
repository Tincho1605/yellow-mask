import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface UIValue {
  searchOpen: boolean;
  menuOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setMenuOpen: (open: boolean) => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(
    () => ({
      searchOpen,
      menuOpen,
      openSearch: () => {
        setMenuOpen(false);
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
      setMenuOpen,
    }),
    [searchOpen, menuOpen],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <UIProvider>');
  return ctx;
}
