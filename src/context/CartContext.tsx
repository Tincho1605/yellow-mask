import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { FACE_BY_ID, PACK_BY_ID, UNIT_PRICE, type FaceId, type Pack } from '../data/product';

export interface CartLine {
  /** Clave estable: mismo pack + mismas caras = misma línea. */
  key: string;
  packId: Pack['id'];
  faces: FaceId[];
  /** Número de packs de esta combinación. */
  quantity: number;
}

export interface CartLineView extends CartLine {
  pack: Pack;
  pieces: number;
  originalLinePrice: number;
  linePrice: number;
  discount: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  discounts: { title: string; amount: number }[];
}

type Action =
  | { type: 'add'; packId: Pack['id']; faces: FaceId[] }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] };

const STORAGE_KEY = 'yellow-club-cart-v1';
export const MAX_LINE_QUANTITY = 10;

export function lineKey(packId: Pack['id'], faces: FaceId[]): string {
  return `${packId}:${[...faces].sort().join('+')}`;
}

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const faces = [...action.faces].sort() as FaceId[];
      const key = lineKey(action.packId, faces);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, l.quantity + 1) } : l,
        );
      }
      return [...state, { key, packId: action.packId, faces, quantity: 1 }];
    }
    case 'setQuantity': {
      if (action.quantity <= 0) return state.filter((l) => l.key !== action.key);
      const quantity = Math.min(MAX_LINE_QUANTITY, Math.floor(action.quantity));
      return state.map((l) => (l.key === action.key ? { ...l, quantity } : l));
    }
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    case 'replace':
      return action.lines;
  }
}

/** Lee el carrito guardado descartando cualquier dato corrupto o desconocido. */
function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): CartLine[] => {
      if (!item || typeof item !== 'object') return [];
      const { packId, faces, quantity } = item as Partial<CartLine>;
      const pack = packId ? PACK_BY_ID[packId] : undefined;
      if (!pack || !Array.isArray(faces) || faces.length !== pack.quantity) return [];
      if (!faces.every((f) => typeof f === 'string' && f in FACE_BY_ID)) return [];
      const qty = Number(quantity);
      if (!Number.isFinite(qty) || qty < 1) return [];
      const sorted = [...faces].sort() as FaceId[];
      return [{ key: lineKey(pack.id, sorted), packId: pack.id, faces: sorted, quantity: Math.min(MAX_LINE_QUANTITY, qty) }];
    });
  } catch {
    return [];
  }
}

export function describeLine(line: CartLine): CartLineView {
  const pack = PACK_BY_ID[line.packId];
  const pieces = pack.quantity * line.quantity;
  const originalLinePrice = UNIT_PRICE * pieces;
  const linePrice = pack.price * line.quantity;
  return { ...line, pack, pieces, originalLinePrice, linePrice, discount: originalLinePrice - linePrice };
}

export function computeTotals(lines: CartLineView[]): CartTotals {
  const discountsMap = new Map<string, number>();
  let itemCount = 0;
  let subtotal = 0;
  let total = 0;
  for (const l of lines) {
    itemCount += l.pieces;
    subtotal += l.originalLinePrice;
    total += l.linePrice;
    if (l.discount > 0 && l.pack.discountTitle) {
      discountsMap.set(l.pack.discountTitle, (discountsMap.get(l.pack.discountTitle) ?? 0) + l.discount);
    }
  }
  return {
    itemCount,
    subtotal,
    total,
    discount: subtotal - total,
    discounts: [...discountsMap].map(([title, amount]) => ({ title, amount })),
  };
}

interface CartContextValue {
  lines: CartLineView[];
  totals: CartTotals;
  isOpen: boolean;
  lastAddedKey: string | null;
  /** Cambia en cada alta, útil para animar el icono del carrito. */
  addSignal: number;
  addPack: (packId: Pack['id'], faces: FaceId[]) => string;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const [addSignal, setAddSignal] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.map(({ packId, faces, quantity }) => ({ packId, faces, quantity }))),
      );
    } catch {
      /* almacenamiento no disponible (modo privado): el carrito sigue funcionando en memoria */
    }
  }, [state]);

  // Sincroniza el carrito entre pestañas abiertas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      dispatch({ type: 'replace', lines: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addPack = useCallback((packId: Pack['id'], faces: FaceId[]) => {
    dispatch({ type: 'add', packId, faces });
    const key = lineKey(packId, faces);
    setLastAddedKey(key);
    setAddSignal((n) => n + 1);
    return key;
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = state.map(describeLine);
    return {
      lines,
      totals: computeTotals(lines),
      isOpen,
      lastAddedKey,
      addSignal,
      addPack,
      setQuantity: (key, quantity) => dispatch({ type: 'setQuantity', key, quantity }),
      removeLine: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        setLastAddedKey(null);
      },
    };
  }, [state, isOpen, lastAddedKey, addSignal, addPack]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
