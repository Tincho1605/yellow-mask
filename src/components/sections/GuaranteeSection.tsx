import { Reveal } from '../ui/Reveal';
import { Link } from '../ui/Link';

/** E: garantía (texto e imagen de la página de referencia). */
export function GuaranteeSection() {
  return (
    <section aria-labelledby="guarantee-title" className="pb-10 md:pb-14">
      <div className="page-width">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-0">
          <Reveal className="mx-auto w-full max-w-[520px] md:max-w-none">
            <img
              src="/images/sello-garantia-90-dias.webp"
              alt="Sello dorado de 90 días de garantía Yellow Club"
              width={1254}
              height={1254}
              loading="lazy"
              className="aspect-square h-auto w-full rounded-media object-cover"
            />
          </Reveal>
          <Reveal order={1} className="text-center md:px-[70px] md:text-left">
            <h2 id="guarantee-title" className="h-section uppercase">
              Garantía de 90 días
            </h2>
            <p className="mt-4 text-[15px] leading-[1.9] font-bold tracking-[0.04em] text-ink/75">
              Si tu pedido llega dañado o presenta algún defecto de fabricación, contáctanos y revisaremos tu caso para darte
              una solución.
            </p>
            <Link
              to="/contacto"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-button border border-ink px-7 text-[14px] font-bold tracking-[0.08em] transition-all duration-200 hover:bg-ink hover:text-white"
            >
              CONTÁCTANOS
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
