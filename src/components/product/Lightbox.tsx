import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { GALLERY } from '../../data/product';
import { useModal } from '../../hooks/useModal';
import { ChevronLeft, ChevronRight, CloseIcon } from '../ui/Icons';

interface LightboxProps {
  open: boolean;
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

const ZOOM = 2.4;

/**
 * Visor a pantalla completa con zoom: clic/tap alterna el zoom y el puntero
 * desplaza la imagen ampliada. Flechas del teclado para navegar, Escape cierra.
 */
export function Lightbox({ open, index, onIndexChange, onClose }: LightboxProps) {
  const ref = useModal<HTMLDivElement>(open, onClose);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => setZoomed(false), [index, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndexChange(index + 1);
      if (e.key === 'ArrowLeft') onIndexChange(index - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, onIndexChange]);

  const updateOrigin = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    });
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (!zoomed && Math.abs(dx) > 50) {
      onIndexChange(index + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) < 8 && Math.abs(e.clientY - s.y) < 8) {
      updateOrigin(e);
      setZoomed((z) => !z);
    }
  };

  const img = GALLERY[index];

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes ampliada"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[80] flex flex-col bg-white transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <span className="text-[13px] font-semibold tracking-[0.08em] text-ink/70">
          {index + 1} / {GALLERY.length}
        </span>
        <span className="hidden text-[13px] text-ink/60 md:block">
          {zoomed ? 'Mueve el cursor para explorar · clic para alejar' : 'Clic en la imagen para ampliar'}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar galería"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper transition-transform hover:scale-105"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
        <div
          className={`relative h-full max-h-[calc(100vh-190px)] w-full max-w-[calc(100vh-190px)] touch-none overflow-hidden rounded-media select-none ${
            zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
          onPointerMove={(e) => zoomed && updateOrigin(e)}
          onPointerUp={onPointerUp}
        >
          {open && (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              draggable={false}
              className="h-full w-full animate-fade-in object-contain transition-transform duration-300 ease-out"
              style={{ transform: zoomed ? `scale(${ZOOM})` : 'scale(1)', transformOrigin: `${origin.x}% ${origin.y}%` }}
            />
          )}
        </div>
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => onIndexChange(index + (dir === 'next' ? 1 : -1))}
            aria-label={dir === 'next' ? 'Imagen siguiente' : 'Imagen anterior'}
            className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-ink/10 transition-transform hover:scale-105 ${
              dir === 'prev' ? 'left-2 md:left-6' : 'right-2 md:right-6'
            }`}
          >
            {dir === 'prev' ? <ChevronLeft /> : <ChevronRight />}
          </button>
        ))}
      </div>

      <ul className="no-scrollbar mx-auto flex max-w-full gap-2 overflow-x-auto px-4 py-4">
        {GALLERY.map((g, i) => (
          <li key={g.src}>
            <button
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === index}
              className={`block h-14 w-14 overflow-hidden rounded-[8px] transition-all ${
                i === index ? 'ring-[1.5px] ring-ink' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={g.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}
