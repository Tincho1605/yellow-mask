import { FACES } from '../../data/product';
import { useProduct } from '../../context/ProductContext';
import { scrollToSection } from '../../context/RouterContext';
import { CheckIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

/** D: galería de las cuatro expresiones. Cada tarjeta selecciona esa cara. */
export function FacesSection() {
  const { face, selectFace } = useProduct();
  return (
    <section aria-labelledby="faces-title" className="pt-2 pb-8 md:pb-10">
      <div className="page-width">
        <Reveal>
          <h2 id="faces-title" className="h-section">
            Elige tu expresión
          </h2>
        </Reveal>
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 lg:grid-cols-4 lg:gap-x-4">
          {FACES.map((f, i) => {
            const selected = f.id === face;
            return (
              <Reveal as="li" key={f.id} order={i + 1}>
                <button
                  type="button"
                  onClick={() => {
                    selectFace(f.id);
                    scrollToSection('product');
                  }}
                  aria-pressed={selected}
                  aria-label={`Elegir ${f.name}`}
                  className="group block w-full text-center"
                >
                  <span className="relative block overflow-hidden rounded-media bg-white">
                    <img
                      src={f.image}
                      alt={f.alt}
                      width={1254}
                      height={1254}
                      loading="lazy"
                      className={`aspect-square w-full object-cover transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.05] ${
                        f.goggles ? 'group-hover:opacity-0' : ''
                      }`}
                    />
                    {f.goggles && (
                      <img
                        src={f.goggles.src}
                        alt=""
                        width={1170}
                        height={1170}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
                      />
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-yc transition-all duration-300 ${
                        selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      }`}
                      aria-hidden
                    >
                      <CheckIcon width={14} height={14} />
                    </span>
                    <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-ink py-2 text-[12px] font-bold tracking-[0.08em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      {selected ? 'SELECCIONADA' : 'ELEGIR ESTA CARA'}
                    </span>
                  </span>
                  <span className="mt-4 block font-heading text-[16px] font-extrabold tracking-[0.06em] md:text-[18px]">
                    {f.name}
                  </span>
                  <span className="mt-1.5 block px-2 text-[14px] leading-[1.75] tracking-[0.05em] text-ink/75 md:text-[15px]">
                    {f.description}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
