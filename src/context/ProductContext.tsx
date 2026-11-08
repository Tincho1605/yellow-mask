import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { PACKS, type FaceId, type Pack } from '../data/product';

type Picks = Record<Pack['id'], (FaceId | null)[]>;

/**
 * Estado de compra de la ficha de producto:
 * - `face`: cara elegida en el selector principal (variante).
 * - `packId`: pack activo.
 * - `picks`: selección independiente de cada pieza dentro de cada pack.
 *   La pieza #1 sigue a la cara principal; el resto se elige explícitamente.
 * - `galleryFace`: cara que la galería debe mostrar (último cambio del usuario).
 */
interface ProductContextValue {
  face: FaceId;
  packId: Pack['id'];
  picks: Picks;
  galleryFace: { id: FaceId; nonce: number } | null;
  selectFace: (face: FaceId) => void;
  selectPack: (packId: Pack['id']) => void;
  setPick: (packId: Pack['id'], index: number, face: FaceId | null) => void;
  resetPicks: (packId: Pack['id']) => void;
}

const INITIAL_FACE: FaceId = 'lengua-fuera';

function initialPicks(face: FaceId): Picks {
  return Object.fromEntries(
    PACKS.map((p) => [p.id, Array.from({ length: p.quantity }, (_, i) => (i === 0 ? face : null))]),
  ) as Picks;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [face, setFace] = useState<FaceId>(INITIAL_FACE);
  const [packId, setPackId] = useState<Pack['id']>('pack-1');
  const [picks, setPicks] = useState<Picks>(() => initialPicks(INITIAL_FACE));
  const [galleryFace, setGalleryFace] = useState<ProductContextValue['galleryFace']>(null);

  const showInGallery = useCallback((id: FaceId) => {
    setGalleryFace((g) => ({ id, nonce: (g?.nonce ?? 0) + 1 }));
  }, []);

  const selectFace = useCallback(
    (next: FaceId) => {
      setFace(next);
      setPicks((prev) => {
        const copy = { ...prev };
        for (const p of PACKS) copy[p.id] = prev[p.id].map((f, i) => (i === 0 ? next : f));
        return copy;
      });
      showInGallery(next);
    },
    [showInGallery],
  );

  const setPick = useCallback(
    (pid: Pack['id'], index: number, value: FaceId | null) => {
      setPicks((prev) => ({ ...prev, [pid]: prev[pid].map((f, i) => (i === index ? value : f)) }));
      if (value) showInGallery(value);
    },
    [showInGallery],
  );

  const resetPicks = useCallback(
    (pid: Pack['id']) => {
      setPicks((prev) => ({ ...prev, [pid]: prev[pid].map((_, i) => (i === 0 ? face : null)) }));
    },
    [face],
  );

  const value = useMemo(
    () => ({ face, packId, picks, galleryFace, selectFace, selectPack: setPackId, setPick, resetPicks }),
    [face, packId, picks, galleryFace, selectFace, setPick, resetPicks],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct debe usarse dentro de <ProductProvider>');
  return ctx;
}
