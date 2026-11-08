import { TICKER_ITEMS } from '../../data/product';

/** Banda amarilla en movimiento continuo (se pausa al pasar el cursor). */
export function Ticker() {
  const items = Array.from({ length: 4 }, () => TICKER_ITEMS).flat();
  return (
    <section aria-label="Características destacadas" className="group overflow-hidden bg-yc py-3 md:py-4">
      <p className="sr-only">{TICKER_ITEMS.join(' · ')}</p>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-[60px] pr-[60px] md:gap-[100px] md:pr-[100px]">
            {items.map((t, i) => (
              <span key={i} className="text-[16px] leading-none font-bold tracking-normal whitespace-nowrap uppercase md:text-[18px]">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
