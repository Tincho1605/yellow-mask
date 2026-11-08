import { asset } from '../../lib/asset';
import { FACES } from '../../data/product';
import { useProduct } from '../../context/ProductContext';
import { scrollToSection } from '../../context/RouterContext';
import { Reveal } from '../ui/Reveal';

const WITH_GOGGLES = FACES.filter((f) => f.goggles);

/** C: compatibilidad con goggles (texto, infografía y fotos reales con goggles). */
export function GogglesSection() {
  const { selectFace } = useProduct();
  return (
    <section aria-labelledby="goggles-title" className="pt-[21px] md:pt-7">
      <div className="page-width">
        <div className="grid items-center md:grid-cols-2">
          <Reveal className="order-1 overflow-hidden rounded-media md:order-2">
            <img
              src={asset('images/infografia-goggles.webp')}
              alt="Infografía de uso del pasamontañas con goggles: zona de ojos despejada, ajuste cómodo alrededor del rostro y la máscara sigue siendo protagonista"
              width={1400}
              height={1400}
              loading="lazy"
              className="aspect-square h-auto w-full object-cover"
            />
          </Reveal>
          <Reveal order={1} className="order-2 py-9 md:order-1 md:px-[70px] md:py-10">
            <h2 id="goggles-title" className="h-section max-w-[460px]">
              Tus goggles siguen siendo parte del look
            </h2>
            <p className="mt-5 max-w-[520px] text-[15px] leading-[1.9] font-bold tracking-[0.04em] text-ink/75">
              La abertura frontal está pensada para dejar espacio en la zona de los ojos y combinar la máscara con goggles o
              gafas de nieve sin esconder su diseño.
            </p>

            <p className="mt-7 text-[12px] font-bold tracking-[0.14em] text-yc-dark uppercase">Así se ve con goggles</p>
            <ul className="mt-3 grid max-w-[520px] grid-cols-2 gap-3">
              {WITH_GOGGLES.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => {
                      selectFace(f.id);
                      scrollToSection('product');
                    }}
                    aria-label={`Elegir ${f.name} (foto con goggles)`}
                    className="group block w-full text-left"
                  >
                    <span className="block overflow-hidden rounded-media bg-white ring-1 ring-ink/[0.08]">
                      <img
                        src={f.goggles!.src}
                        alt={f.goggles!.alt}
                        width={1170}
                        height={1170}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 text-[14px] font-semibold">
                      {f.name}
                      <span className="text-[12px] font-bold text-ink/50 transition-colors group-hover:text-ink">Elegir →</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
