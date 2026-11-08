import { useEffect, useRef, useState } from 'react';
import { FACES, FACE_BY_ID, PACK_BY_ID, PRODUCT, discountPercent, type FaceId } from '../../data/product';
import { useCart } from '../../context/CartContext';
import { useProduct } from '../../context/ProductContext';
import { scrollToSection } from '../../context/RouterContext';
import { formatMoney } from '../../lib/money';
import { AccordionItem } from '../ui/Accordion';
import { AlertIcon, CheckIcon } from '../ui/Icons';
import { Link } from '../ui/Link';
import { StarRating } from '../ui/StarRating';
import { PackSelector } from './PackSelector';

type AddState = 'idle' | 'adding' | 'added' | 'error';

function FaceVariantPicker() {
  const { face, selectFace } = useProduct();
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-[13px] tracking-[0.04em] text-ink/75">
        Cara: <span className="font-semibold text-ink">{FACE_BY_ID[face].name}</span>
      </legend>
      <div className="flex flex-wrap gap-[7px]">
        {FACES.map((f) => {
          const checked = f.id === face;
          return (
            <label key={f.id} className="cursor-pointer">
              <input
                type="radio"
                name="cara"
                value={f.id}
                checked={checked}
                onChange={() => selectFace(f.id)}
                className="peer sr-only"
              />
              <span
                className={`inline-flex min-h-[37px] items-center rounded-[40px] border px-5 py-[7px] text-[14px] tracking-[0.06em] transition-all duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink active:scale-95 ${
                  checked
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/55 bg-white text-ink hover:border-ink hover:shadow-[0_0_0_1px_#111]'
                }`}
              >
                {f.name}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProductInfo() {
  const { face, packId, picks } = useProduct();
  const { addPack, open: openCart } = useCart();
  const [state, setState] = useState<AddState>('idle');
  const [invalid, setInvalid] = useState<number[]>([]);
  const [shake, setShake] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const pack = PACK_BY_ID[packId];
  const current = picks[packId];
  const missing = current.flatMap((f, i) => (f ? [] : [i]));
  const percent = discountPercent(pack.price, pack.compareAtPrice);
  const perPiece = Math.round(pack.price / pack.quantity);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  // Al cambiar de pack se limpian los avisos de validación.
  useEffect(() => {
    setInvalid([]);
    setState((s) => (s === 'error' ? 'idle' : s));
  }, [packId]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const handleAdd = () => {
    if (state === 'adding') return;
    if (missing.length) {
      setInvalid(missing);
      setState('error');
      setShake(true);
      later(() => setShake(false), 500);
      const selects = rootRef.current?.querySelectorAll<HTMLSelectElement>(`[data-pack-panel="${packId}"] select`);
      [...(selects ?? [])].find((s) => !s.value)?.focus();
      return;
    }
    setInvalid([]);
    setState('adding');
    later(() => {
      addPack(packId, current as FaceId[]);
      setState('added');
      later(openCart, 450);
      later(() => setState('idle'), 2200);
    }, 380);
  };

  const missingText =
    missing.length === 1
      ? `Elige la cara de la pieza #${missing[0] + 1} para continuar.`
      : `Elige la cara de las piezas ${missing.map((i) => `#${i + 1}`).join(', ')} para continuar.`;

  return (
    <div ref={rootRef} className="product-info">
      <p className="flex min-h-[34px] items-center justify-center rounded-full bg-yc px-4 py-1.5 text-center text-[10.5px] leading-tight font-bold tracking-[0.04em] md:text-[11px]">
        {PRODUCT.tagline}
      </p>

      <h1 className="mt-2.5 font-heading text-[clamp(22.5px,7.3vw,29px)] leading-[1.08] font-extrabold tracking-[-0.02em] md:mt-3 md:text-[40px]">
        <span key={face} className="inline-block animate-fade-in">
          Yellow Club – {FACE_BY_ID[face].name}
        </span>
      </h1>

      <button
        type="button"
        onClick={() => scrollToSection('reviews')}
        className="mt-1.5 flex items-center gap-2 text-[16px] tracking-[0.04em] text-ink/75 transition-colors hover:text-ink md:mt-3"
        aria-label={`Valoración ${PRODUCT.rating} de 5, ${PRODUCT.ratingLabel}. Ver opiniones`}
      >
        <StarRating rating={PRODUCT.rating} size={17} />
        <span>
          {PRODUCT.rating}/5 {PRODUCT.ratingLabel}
        </span>
      </button>

      <div className="mt-2.5 md:mt-3.5" aria-live="polite">
        <div key={packId} className="flex animate-fade-in flex-wrap items-center gap-x-4 gap-y-2">
          <span className="sr-only">Precio habitual</span>
          <s className="text-[16px] font-bold tracking-[0.06em] text-ink/75 md:text-[18px]">
            {formatMoney(pack.compareAtPrice, true)}
          </s>
          <span className="sr-only">Precio de oferta</span>
          <span className="text-[23px] font-extrabold tracking-[0.06em] md:text-[20px]">{formatMoney(pack.price, true)}</span>
          {percent > 0 && (
            <span className="rounded-full bg-ink px-[14px] py-[3px] text-[13px] font-bold tracking-[0.08em] text-white">
              Oferta {percent}%
            </span>
          )}
        </div>
        {pack.quantity > 1 && (
          <p className="mt-1 text-[13px] text-ink/70">
            {pack.quantity} piezas · {formatMoney(perPiece)} por pieza
          </p>
        )}
      </div>

      <p className="mt-2 text-[12px] tracking-[0.06em] text-ink/75 md:mt-3">
        Los{' '}
        <Link to="/politicas/envio" className="underline underline-offset-2 hover:text-ink">
          gastos de envío
        </Link>{' '}
        se calculan en la pantalla de pago.
      </p>

      <ul className="mt-2.5 flex flex-col items-start gap-2" aria-label="Beneficios">
        {PRODUCT.benefits.map((b) => (
          <li
            key={b}
            className="inline-flex w-fit items-center rounded-full border border-ink/[0.14] bg-white px-2.5 py-[7px] text-[11.2px] leading-[1.2] font-bold tracking-[0.02em] transition-colors hover:border-ink/30"
          >
            {b}
          </li>
        ))}
      </ul>

      <FaceVariantPicker />

      <PackSelector invalid={invalid} onPickChange={() => setInvalid((inv) => (inv.length ? [] : inv))} />

      <button
        type="button"
        onClick={handleAdd}
        aria-describedby="crew-status"
        className={`relative flex min-h-[58px] w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] px-5 py-4 text-[15.5px] font-extrabold tracking-[0.02em] transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_6px_18px_-8px_rgba(17,17,17,0.45)] active:translate-y-0 active:scale-[0.99] ${
          state === 'added' ? 'bg-ink text-yc' : 'bg-yc text-ink'
        } ${shake ? 'animate-shake' : ''} ${state === 'adding' ? 'cursor-wait' : ''}`}
      >
        {state === 'adding' && (
          <>
            <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden />
            AGREGANDO…
          </>
        )}
        {state === 'added' && (
          <>
            <CheckIcon /> ¡AGREGADO AL CARRITO!
          </>
        )}
        {(state === 'idle' || state === 'error') && (
          <>
            AGREGAR AL CARRITO
            <span className="hidden font-bold opacity-80 min-[400px]:inline">· {formatMoney(pack.price)}</span>
          </>
        )}
      </button>

      <p id="crew-status" role="status" className="mt-2.5 min-h-[20px] text-center text-[12.5px] leading-snug">
        {state === 'error' && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-sale">
            <AlertIcon /> {missingText}
          </span>
        )}
        {state === 'adding' && <span className="text-ink/70">Agregando tu crew…</span>}
        {state === 'added' && (
          <span className="font-semibold text-ink">
            Listo: {pack.name.toLowerCase()} agregado. Abriendo tu carrito…
          </span>
        )}
        {state === 'idle' && missing.length > 0 && (
          <span className="text-ink/60">
            {missing.length === 1 ? 'Falta 1 cara por elegir' : `Faltan ${missing.length} caras por elegir`} en tu pack.
          </span>
        )}
        {state === 'idle' && missing.length === 0 && pack.quantity > 1 && (
          <span className="text-ink/60">Descuento del pack aplicado automáticamente en el carrito.</span>
        )}
      </p>

      <div className="mt-3 border-t border-ink/10">
        <AccordionItem
          defaultOpen
          title={<span className="font-heading text-[15px] font-bold tracking-[0.04em]">Descripción</span>}
        >
          {PRODUCT.description.map((p) => (
            <p key={p} className="mb-2.5">
              {p}
            </p>
          ))}
          <ul className="mt-2 space-y-1.5">
            {PRODUCT.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-yc text-ink">
                  <CheckIcon width={11} height={11} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem title={<span className="font-heading text-[15px] font-bold tracking-[0.04em]">Compatibilidad con goggles</span>}>
          <p>
            La abertura frontal está pensada para dejar espacio en la zona de los ojos y combinar la máscara con goggles o
            gafas de nieve sin esconder su diseño.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}
