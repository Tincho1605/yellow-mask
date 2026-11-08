import { useState, type FormEvent, type ReactNode } from 'react';
import { POLICY_LINKS } from '../../data/navigation';
import { AlertIcon, CheckIcon } from '../ui/Icons';
import { Link } from '../ui/Link';

function PageShell({ title, children, narrow = true }: { title: string; children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`page-width py-10 md:py-16 ${narrow ? 'max-w-[820px]' : ''}`}>
      <h1 className="h-section">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 inline-flex items-start gap-2 rounded-[10px] bg-yc-soft px-4 py-3 text-[13px] leading-snug">
      <AlertIcon className="mt-px shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function Field({
  id,
  label,
  error,
  textarea,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  textarea?: boolean;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const cls = `w-full rounded-input border px-3.5 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_1px_#111] ${
    error ? 'border-sale' : 'border-ink/40 focus:border-ink'
  }`;
  const common = {
    id,
    value: rest.value,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-err` : undefined,
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-semibold">
        {label}
      </label>
      {textarea ? (
        <textarea {...common} rows={5} onChange={(e) => rest.onChange(e.target.value)} className={`${cls} py-3`} />
      ) : (
        <input
          {...common}
          type={rest.type ?? 'text'}
          autoComplete={rest.autoComplete}
          onChange={(e) => rest.onChange(e.target.value)}
          className={`${cls} h-12`}
        />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[12px] font-semibold text-sale">
          {error}
        </p>
      )}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPage() {
  const [v, setV] = useState({ name: '', email: '', order: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!v.name.trim()) next.name = 'Ingresa tu nombre';
    if (!EMAIL_RE.test(v.email.trim())) next.email = 'Ingresa un correo válido';
    if (v.message.trim().length < 10) next.message = 'Cuéntanos un poco más (mínimo 10 caracteres)';
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <PageShell title="Contacto">
      <DemoNotice>Formulario de demostración: conecta aquí el formulario de contacto de Shopify o tu servicio de correo.</DemoNotice>
      {sent ? (
        <div className="flex animate-fade-in items-start gap-3 rounded-media bg-paper p-6" role="status">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yc">
            <CheckIcon />
          </span>
          <div>
            <p className="font-heading text-[20px] font-extrabold">¡Gracias, {v.name.split(' ')[0]}!</p>
            <p className="mt-1 text-ink/75">Tu mensaje quedó registrado en esta demostración.</p>
            <button type="button" onClick={() => { setSent(false); setV({ name: '', email: '', order: '', message: '' }); }} className="mt-3 text-[14px] underline">
              Enviar otro mensaje
            </button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field id="c-name" label="Nombre" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
          <Field id="c-email" label="Correo electrónico" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
          <div className="sm:col-span-2">
            <Field id="c-order" label="Número de pedido (opcional)" value={v.order} onChange={set('order')} />
          </div>
          <div className="sm:col-span-2">
            <Field id="c-msg" label="Mensaje" textarea value={v.message} onChange={set('message')} error={errors.message} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex min-h-[52px] items-center rounded-button bg-yc px-10 font-bold tracking-[0.04em] transition-transform hover:-translate-y-px">
              Enviar
            </button>
          </div>
        </form>
      )}
    </PageShell>
  );
}

export function AccountPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  return (
    <PageShell title="Iniciar sesión">
      <DemoNotice>Demostración: las cuentas de cliente se habilitan al conectar Shopify Customer Accounts.</DemoNotice>
      {done ? (
        <p className="animate-fade-in rounded-media bg-paper p-6" role="status">
          En la tienda real enviaríamos un código de acceso a <strong>{email}</strong>.
        </p>
      ) : (
        <form
          noValidate
          className="max-w-[420px] space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!EMAIL_RE.test(email.trim())) return setError('Ingresa un correo válido');
            setError('');
            setDone(true);
          }}
        >
          <Field id="acc-email" label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={setEmail} error={error} />
          <button type="submit" className="inline-flex min-h-[52px] w-full items-center justify-center rounded-button bg-ink font-bold tracking-[0.04em] text-white transition-transform hover:-translate-y-px">
            Continuar
          </button>
        </form>
      )}
    </PageShell>
  );
}

export function PolicyPage({ slug }: { slug: string }) {
  const link = POLICY_LINKS.find((l) => l.to === `/politicas/${slug}`);
  if (!link) return <NotFoundPage />;
  return (
    <PageShell title={link.label}>
      <DemoNotice>
        Contenido de demostración. Sustituye este texto por la {link.label.toLowerCase()} oficial de la tienda antes de
        publicar.
      </DemoNotice>
      <div className="rte space-y-4 text-[15px] leading-[1.8] text-ink/80">
        <p>
          Esta página está preparada para alojar la {link.label.toLowerCase()} de Yellow Club. Mantén el texto claro, con
          secciones cortas y datos de contacto visibles.
        </p>
        <p>
          ¿Tienes dudas? Escríbenos desde la página de{' '}
          <Link to="/contacto" className="underline">
            contacto
          </Link>
          .
        </p>
      </div>
      <nav aria-label="Otras políticas" className="mt-10 border-t border-ink/10 pt-6">
        <ul className="flex flex-wrap gap-2">
          {POLICY_LINKS.filter((l) => l !== link).map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="inline-block rounded-full border border-ink/20 px-3 py-1 text-[13px] hover:border-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageShell>
  );
}

export function NotFoundPage() {
  return (
    <PageShell title="Página no encontrada">
      <p className="text-ink/75">La página que buscas no existe.</p>
      <Link to="/" className="mt-6 inline-flex min-h-[50px] items-center rounded-button bg-yc px-8 font-bold">
        Volver a la tienda
      </Link>
    </PageShell>
  );
}
