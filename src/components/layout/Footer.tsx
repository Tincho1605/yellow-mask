import { asset } from '../../lib/asset';
import { FOOTER_HELP, MAIN_MENU, POLICY_LINKS } from '../../data/navigation';
import { Link } from '../ui/Link';

const PAYMENT_ICONS = [
  ['apple_pay', 'Apple Pay'],
  ['google_pay', 'Google Pay'],
  ['maestro', 'Maestro'],
  ['master', 'Mastercard'],
  ['paypal', 'PayPal'],
  ['shopify_pay', 'Shop Pay'],
  ['visa', 'Visa'],
] as const;

/** Ondas animadas amarillas que conectan el contenido con el footer. */
export function WaveDivider() {
  return (
    <div className="relative -mb-px bg-white text-yc" aria-hidden>
      <svg
        className="block h-auto max-h-12 w-full overflow-hidden lg:max-h-24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="wave-1">
          <use href="#gentle-wave" x="50" y="3" fill="currentColor" />
        </g>
        <g className="wave-2">
          <use href="#gentle-wave" x="50" y="0" fill="currentColor" />
        </g>
        <g className="wave-3">
          <use href="#gentle-wave" x="50" y="9" fill="currentColor" />
        </g>
        <g className="wave-4">
          <use href="#gentle-wave" x="50" y="6" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="mb-5 font-heading text-[18px] font-extrabold">{title}</h2>
      <ul className="space-y-[10px]">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-[14px] tracking-[0.06em] text-ink/80 underline-offset-[3px] transition-colors hover:text-ink hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-yc text-ink">
      <div className="page-width pt-10 pb-8 md:pt-14">
        <div className="grid gap-10 sm:grid-cols-2">
          <FooterColumn title="Tienda" links={MAIN_MENU} />
          <FooterColumn title="Ayuda" links={FOOTER_HELP} />
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-ink/10 pt-6 md:mt-20 md:flex-row-reverse md:items-center md:justify-between">
          <div>
            <span className="sr-only">Formas de pago</span>
            <ul className="flex flex-wrap gap-[6px]" aria-label="Formas de pago">
              {PAYMENT_ICONS.map(([file, label]) => (
                <li key={file}>
                  <img src={asset(`payment/${file}.svg`)} alt={label} width={38} height={24} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[11.5px] tracking-[0.06em] text-ink/75">
            <p>© {new Date().getFullYear()} · Yellow Club · Todos los derechos reservados</p>
            <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {POLICY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
