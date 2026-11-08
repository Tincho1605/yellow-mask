import { PRODUCT } from '../../data/product';
import { Reveal } from '../ui/Reveal';

const FEATURE_ICONS = ['📸', '🥽', '🧣', '🏔️'];

/** A + B: titular de presentación, foto lifestyle y características reales del producto. */
export function PresentationSection() {
  return (
    <section aria-labelledby="presentation-title" className="pb-6 md:pb-7">
      <Reveal className="page-width text-center">
        <h2 id="presentation-title" className="h-section">
          Sube abrigado. Baja con la mejor foto.
        </h2>
        <p className="mx-auto mt-3 max-w-[1080px] text-[15px] leading-[1.8] tracking-[0.05em] md:mt-4 md:text-[16px]">
          Una pieza para cubrir cabeza, rostro y cuello sin esconder la personalidad. Elige tu cara y llévala a la nieve,
          senderos y viajes de invierno.
        </p>
      </Reveal>

      <div className="page-width mt-7 md:mt-9">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-0">
          <Reveal className="overflow-hidden rounded-media">
            <img
              src="/images/selfie-cima-nevada.webp"
              alt="Selfie en la cima nevada con el pasamontañas Yellow Club Lengua fuera y goggles"
              width={1122}
              height={1402}
              loading="lazy"
              className="aspect-[1122/1402] h-auto w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
            />
          </Reveal>

          <Reveal order={1} className="md:px-[70px] md:py-10">
            <p className="text-[12px] font-bold tracking-[0.14em] text-yc-dark uppercase">Beneficios y características</p>
            <h3 className="mt-2 font-heading text-[28px] leading-[1.12] font-extrabold md:text-[34px]">
              Abrigado sin desaparecer en las fotos
            </h3>
            <div className="rte mt-4 text-[15px] leading-[1.75] text-ink/75">
              {PRODUCT.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {PRODUCT.features.map((f, i) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-media border border-ink/[0.08] bg-paper p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(17,17,17,0.35)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yc text-[18px]" aria-hidden>
                    {FEATURE_ICONS[i]}
                  </span>
                  <span className="text-[14px] leading-snug font-semibold tracking-[0.02em]">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
