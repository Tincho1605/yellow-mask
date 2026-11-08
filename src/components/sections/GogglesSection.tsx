import { Reveal } from '../ui/Reveal';

/** C: compatibilidad con goggles (texto + infografía de la referencia). */
export function GogglesSection() {
  return (
    <section aria-labelledby="goggles-title" className="pt-[21px] md:pt-7">
      <div className="page-width">
        <div className="grid items-center md:grid-cols-2">
          <Reveal className="order-1 overflow-hidden rounded-media md:order-2">
            <img
              src="/images/infografia-goggles.webp"
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
