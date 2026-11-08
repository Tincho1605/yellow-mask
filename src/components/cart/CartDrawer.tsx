import { asset } from '../../lib/asset';
import { useState } from 'react';
import { MAX_LINE_QUANTITY, useCart, type CartLineView } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { useModal } from '../../hooks/useModal';
import { formatMoney } from '../../lib/money';
import { CheckIcon, CloseIcon, TagIcon, TrashIcon } from '../ui/Icons';
import { LineImage, summarizeFaces } from './LineImage';
import { QuantityInput } from './QuantityInput';

function CartLineItem({ line, highlight }: { line: CartLineView; highlight: boolean }) {
  const { setQuantity, removeLine } = useCart();
  const [removing, setRemoving] = useState(false);
  const label = `${line.pack.name} (${summarizeFaces(line.faces)})`;

  const remove = () => {
    setRemoving(true);
    window.setTimeout(() => removeLine(line.key), 250);
  };

  return (
    <li
      className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 rounded-[12px] px-2 py-4 transition-all duration-300 ${
        highlight ? 'animate-flash' : ''
      } ${removing ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <LineImage faces={line.faces} />
      <div className="min-w-0">
        <p className="font-heading text-[15px] leading-tight font-extrabold tracking-[0.04em]">Yellow Club – Pasamontañas</p>
        <dl className="mt-1.5 space-y-0.5 text-[13px] leading-snug text-ink/75">
          <div>
            <dt className="inline">Pack: </dt>
            <dd className="inline font-semibold text-ink">{line.pack.name}</dd>
          </div>
          <div>
            <dt className="inline">{line.pack.quantity > 1 ? 'Caras: ' : 'Cara: '}</dt>
            <dd className="inline">{summarizeFaces(line.faces)}</dd>
          </div>
        </dl>
        {line.discount > 0 && line.pack.discountTitle && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] text-ink/70">
            <TagIcon /> {line.pack.discountTitle} (−{formatMoney(line.discount)})
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <QuantityInput
              value={line.quantity}
              max={MAX_LINE_QUANTITY}
              label={label}
              onChange={(q) => (q <= 0 ? remove() : setQuantity(line.key, q))}
            />
            <button
              type="button"
              onClick={remove}
              aria-label={`Eliminar ${label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.06] hover:text-sale"
            >
              <TrashIcon />
            </button>
          </div>
          <div className="text-right leading-tight whitespace-nowrap">
            {line.discount > 0 && <s className="block text-[12px] text-ink/50">{formatMoney(line.originalLinePrice)}</s>}
            <span className="text-[15px] font-bold">{formatMoney(line.linePrice)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Carrito lateral con animación de entrada, edición de líneas y totales. */
export function CartDrawer() {
  const { lines, totals, isOpen, close, lastAddedKey } = useCart();
  const { navigate } = useRouter();
  const ref = useModal<HTMLDivElement>(isOpen, close);
  const justAdded = lines.find((l) => l.key === lastAddedKey);

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        inert={!isOpen}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white transition-[transform,visibility] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'visible translate-x-0 shadow-[-12px_0_40px_-18px_rgba(17,17,17,0.45)]' : 'invisible translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 md:px-6">
          <h2 id="cart-title" className="font-heading text-[24px] font-extrabold md:text-[28px]">
            Tu carrito {totals.itemCount > 0 && <span className="text-[15px] font-semibold text-ink/55">({totals.itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar carrito"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <CloseIcon />
          </button>
        </div>

        {justAdded && (
          <div className="flex animate-fade-in items-center gap-2 bg-yc px-5 py-2.5 text-[13px] font-semibold md:px-6" role="status">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-yc">
              <CheckIcon width={12} height={12} />
            </span>
            ¡{justAdded.pack.name} agregado al carrito!
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <img src={asset('images/yellow-mask-isotipo.png')} alt="" className="h-24 w-24 opacity-90" />
            <p className="mt-4 font-heading text-[24px] font-extrabold">Tu carrito está vacío</p>
            <button
              type="button"
              onClick={() => {
                close();
                navigate('/comprar');
              }}
              className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-button bg-yc px-8 text-[15px] font-bold transition-transform hover:-translate-y-px"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/[0.08] overflow-y-auto px-3 md:px-4" aria-label="Productos en el carrito">
              {lines.map((line) => (
                <CartLineItem key={line.key} line={line} highlight={line.key === lastAddedKey} />
              ))}
            </ul>

            <div className="border-t border-ink/10 px-5 pt-4 pb-5 md:px-6">
              <dl className="space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink/70">Subtotal</dt>
                  <dd>{formatMoney(totals.subtotal)}</dd>
                </div>
                {totals.discounts.map((d) => (
                  <div key={d.title} className="flex justify-between text-ink/80">
                    <dt className="inline-flex items-center gap-1.5">
                      <TagIcon /> {d.title}
                    </dt>
                    <dd className="font-semibold">−{formatMoney(d.amount)}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between border-t border-ink/10 pt-2.5">
                  <dt className="font-heading text-[17px] font-extrabold">Total estimado</dt>
                  <dd className="text-[18px] font-bold">{formatMoney(totals.total, true)}</dd>
                </div>
              </dl>
              {totals.discount > 0 && (
                <p className="mt-1 text-right text-[12.5px] font-semibold text-yc-dark">
                  Ahorras {formatMoney(totals.discount)} con tus packs
                </p>
              )}
              <p className="mt-2 text-[12px] leading-snug text-ink/60">
                Impuesto incluido. Envío calculado en la pantalla de pago.
              </p>
              <button
                type="button"
                onClick={() => {
                  close();
                  navigate('/checkout');
                }}
                className="mt-4 flex min-h-[54px] w-full items-center justify-center rounded-button bg-yc text-[16px] font-bold tracking-[0.04em] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_6px_18px_-8px_rgba(17,17,17,0.45)]"
              >
                Pagar pedido
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-2 w-full py-2 text-center text-[13px] text-ink/70 underline underline-offset-2 hover:text-ink"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
