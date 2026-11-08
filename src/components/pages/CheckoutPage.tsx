import { useState, type FormEvent } from 'react';
import { useCart, type CartLineView, type CartTotals } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { formatMoney } from '../../lib/money';
import { LineImage, summarizeFaces } from '../cart/LineImage';
import { AlertIcon, TagIcon } from '../ui/Icons';
import { Link } from '../ui/Link';

export const LAST_ORDER_KEY = 'yellow-club-last-order';

export interface DemoOrder {
  number: string;
  email: string;
  name: string;
  address: string;
  lines: { pack: string; faces: string; quantity: number; total: number }[];
  totals: CartTotals;
  createdAt: string;
}

type Fields = 'email' | 'firstName' | 'lastName' | 'address' | 'zip' | 'city' | 'state' | 'phone';

const FIELDS: { name: Fields; label: string; type?: string; autoComplete: string; half?: boolean; pattern?: RegExp; error: string }[] = [
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Ingresa un correo válido' },
  { name: 'firstName', label: 'Nombre', autoComplete: 'given-name', half: true, error: 'Ingresa tu nombre' },
  { name: 'lastName', label: 'Apellidos', autoComplete: 'family-name', half: true, error: 'Ingresa tus apellidos' },
  { name: 'address', label: 'Calle y número', autoComplete: 'street-address', error: 'Ingresa tu dirección' },
  { name: 'zip', label: 'Código postal', autoComplete: 'postal-code', half: true, pattern: /^\d{5}$/, error: 'Código postal de 5 dígitos' },
  { name: 'city', label: 'Ciudad', autoComplete: 'address-level2', half: true, error: 'Ingresa tu ciudad' },
  { name: 'state', label: 'Estado', autoComplete: 'address-level1', half: true, error: 'Ingresa tu estado' },
  { name: 'phone', label: 'Teléfono', type: 'tel', autoComplete: 'tel', half: true, pattern: /^[\d\s+()-]{10,}$/, error: 'Teléfono de al menos 10 dígitos' },
];

export function OrderSummary({ lines, totals }: { lines: CartLineView[] | DemoOrder['lines']; totals: CartTotals }) {
  return (
    <div>
      <ul className="space-y-4">
        {lines.map((l) =>
          'key' in l ? (
            <li key={l.key} className="flex items-center gap-4">
              <div className="relative">
                <LineImage faces={l.faces} size="sm" />
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
                  {l.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1 text-[13px] leading-snug">
                <p className="font-bold">{l.pack.name}</p>
                <p className="text-ink/65">{summarizeFaces(l.faces)}</p>
              </div>
              <div className="text-right text-[14px] leading-tight">
                {l.discount > 0 && <s className="block text-[12px] text-ink/45">{formatMoney(l.originalLinePrice)}</s>}
                {formatMoney(l.linePrice)}
              </div>
            </li>
          ) : (
            <li key={l.pack + l.faces} className="flex justify-between gap-4 text-[14px]">
              <span>
                <strong>{l.pack}</strong> ×{l.quantity}
                <span className="block text-[13px] text-ink/65">{l.faces}</span>
              </span>
              <span>{formatMoney(l.total)}</span>
            </li>
          ),
        )}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-ink/10 pt-4 text-[14px]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatMoney(totals.subtotal)}</dd>
        </div>
        {totals.discounts.map((d) => (
          <div key={d.title} className="flex justify-between">
            <dt className="inline-flex items-center gap-1.5 text-ink/75">
              <TagIcon /> {d.title}
            </dt>
            <dd>−{formatMoney(d.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between text-ink/70">
          <dt>Envío</dt>
          <dd>Por calcular</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
          <dt className="font-heading text-[18px] font-extrabold">Total</dt>
          <dd className="text-[20px] font-bold">{formatMoney(totals.total, true)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function CheckoutPage() {
  const { lines, totals, clear } = useCart();
  const { navigate } = useRouter();
  const [values, setValues] = useState<Record<Fields, string>>(
    () => Object.fromEntries(FIELDS.map((f) => [f.name, ''])) as Record<Fields, string>,
  );
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="page-width py-20 text-center">
        <h1 className="h-section">Tu carrito está vacío</h1>
        <p className="mt-3 text-ink/70">Agrega tu crew antes de pagar.</p>
        <Link
          to="/comprar"
          className="mt-6 inline-flex min-h-[50px] items-center rounded-button bg-yc px-8 font-bold transition-transform hover:-translate-y-px"
        >
          Seguir comprando
        </Link>
      </div>
    );
  }

  const validate = () => {
    const next: Partial<Record<Fields, string>> = {};
    for (const f of FIELDS) {
      const v = values[f.name].trim();
      if (!v || (f.pattern && !f.pattern.test(v))) next[f.name] = f.error;
    }
    return next;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`checkout-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    const order: DemoOrder = {
      number: `YC-${Date.now().toString().slice(-6)}`,
      email: values.email.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      address: `${values.address.trim()}, ${values.zip.trim()} ${values.city.trim()}, ${values.state.trim()}`,
      lines: lines.map((l) => ({ pack: l.pack.name, faces: summarizeFaces(l.faces), quantity: l.quantity, total: l.linePrice })),
      totals,
      createdAt: new Date().toISOString(),
    };
    window.setTimeout(() => {
      try {
        window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      } catch {
        /* sin almacenamiento */
      }
      clear();
      navigate(`/pedido/${order.number}`);
    }, 700);
  };

  return (
    <div className="page-width py-8 md:py-12">
      <h1 className="h-section">Finalizar compra</h1>
      <p className="mt-3 inline-flex items-start gap-2 rounded-[10px] bg-yc-soft px-4 py-3 text-[13px] leading-snug">
        <AlertIcon className="mt-px shrink-0" />
        Checkout de demostración: no se solicitan datos de pago ni se realiza ningún cargo. En producción este paso se
        conecta con el checkout de Shopify.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <form noValidate onSubmit={onSubmit} className="order-2 lg:order-1">
          <fieldset>
            <legend className="font-heading text-[20px] font-extrabold">Contacto y entrega</legend>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {FIELDS.map((f) => (
                <div key={f.name} className={f.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
                  <label htmlFor={`checkout-${f.name}`} className="mb-1 block text-[13px] font-semibold">
                    {f.label}
                  </label>
                  <input
                    id={`checkout-${f.name}`}
                    type={f.type ?? 'text'}
                    autoComplete={f.autoComplete}
                    value={values[f.name]}
                    aria-invalid={!!errors[f.name]}
                    aria-describedby={errors[f.name] ? `checkout-${f.name}-err` : undefined}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [f.name]: e.target.value }));
                      if (errors[f.name]) setErrors((er) => ({ ...er, [f.name]: undefined }));
                    }}
                    className={`h-12 w-full rounded-input border px-3.5 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_1px_#111] ${
                      errors[f.name] ? 'border-sale' : 'border-ink/40 focus:border-ink'
                    }`}
                  />
                  {errors[f.name] && (
                    <p id={`checkout-${f.name}-err`} className="mt-1 text-[12px] font-semibold text-sale">
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="font-heading text-[20px] font-extrabold">Pago</legend>
            <div className="mt-3 rounded-[12px] border border-ink/15 bg-paper p-4 text-[14px] text-ink/75">
              Modo demostración: al confirmar se genera un pedido de prueba y se vacía el carrito.
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-button bg-yc text-[16px] font-extrabold tracking-[0.04em] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_6px_18px_-8px_rgba(17,17,17,0.45)] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting && <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden />}
            {submitting ? 'Procesando…' : `Confirmar pedido · ${formatMoney(totals.total)}`}
          </button>
        </form>

        <aside className="order-1 h-fit rounded-media bg-paper p-5 lg:sticky lg:top-28 lg:order-2" aria-label="Resumen del pedido">
          <h2 className="mb-4 font-heading text-[20px] font-extrabold">Resumen del pedido</h2>
          <OrderSummary lines={lines} totals={totals} />
        </aside>
      </div>
    </div>
  );
}
