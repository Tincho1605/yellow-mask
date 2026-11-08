import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { GALLERY } from '../../data/product';
import { useProduct } from '../../context/ProductContext';
import { ChevronLeft, ChevronRight, ZoomIcon } from '../ui/Icons';
import { Lightbox } from './Lightbox';

const SWIPE_THRESHOLD = 45;

export function ProductGallery() {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const { galleryFace } = useProduct();
  const thumbsRef = useRef<HTMLUListElement>(null);
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const count = GALLERY.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  // La galería sigue a la cara seleccionada en el selector o en los packs.
  useEffect(() => {
    if (!galleryFace) return;
    const i = GALLERY.findIndex((img) => img.faceId === galleryFace.id);
    if (i >= 0) setIndex(i);
  }, [galleryFace]);

  // Mantiene visible la miniatura activa en el carrusel.
  useEffect(() => {
    const list = thumbsRef.current;
    const thumb = list?.children[index] as HTMLElement | undefined;
    if (!list || !thumb) return;
    const left = thumb.offsetLeft - list.clientWidth / 2 + thumb.clientWidth / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [index]);

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      setLightbox(true);
    }
  };

  return (
    <div className="lg:sticky lg:top-[104px]" aria-roledescription="carrusel" aria-label="Galería de imágenes del producto">
      <div
        className="group relative aspect-square touch-pan-y overflow-hidden rounded-media bg-white select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        {GALLERY.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={1254}
            height={1254}
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
            aria-hidden={i !== index}
            className={`absolute inset-0 h-full w-full cursor-zoom-in object-cover transition-[opacity,transform] duration-500 ease-out ${
              i === index ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.02] opacity-0'
            }`}
          />
        ))}

        <button
          type="button"
          onClick={() => setLightbox(true)}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-ink/10 backdrop-blur transition-all duration-200 hover:scale-105 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          aria-label={`Abrir imagen ${index + 1} en pantalla completa`}
        >
          <ZoomIcon />
        </button>

        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(index + (dir === 'next' ? 1 : -1))}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label={dir === 'next' ? 'Imagen siguiente' : 'Imagen anterior'}
            className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-ink/10 transition-all duration-200 hover:scale-105 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 ${
              dir === 'prev' ? 'left-3' : 'right-3'
            }`}
          >
            {dir === 'prev' ? <ChevronLeft /> : <ChevronRight />}
          </button>
        ))}

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-0.5 text-[12px] font-semibold tracking-normal text-ink/80 ring-1 ring-ink/10 md:hidden">
          {index + 1} / {count}
        </div>
      </div>

      <ul
        ref={thumbsRef}
        className="no-scrollbar mt-3 flex snap-x gap-2.5 overflow-x-auto px-0.5 py-0.5 md:mt-4 md:gap-3"
        aria-label="Miniaturas"
      >
        {GALLERY.map((img, i) => (
          <li key={img.src} className="w-[calc((100%-2*10px)/3.2)] shrink-0 snap-start md:w-[calc((100%-4*12px)/5)]">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver imagen ${i + 1}: ${img.alt}`}
              aria-current={i === index}
              className={`block aspect-square w-full overflow-hidden rounded-[10px] bg-white ring-offset-0 transition-all duration-200 ${
                i === index ? 'ring-[1.5px] ring-ink' : 'opacity-85 ring-1 ring-transparent hover:opacity-100 hover:ring-ink/25'
              }`}
            >
              <img src={img.src} alt="" loading="lazy" width={240} height={240} className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox open={lightbox} index={index} onIndexChange={go} onClose={() => setLightbox(false)} />
    </div>
  );
}
