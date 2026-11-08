import { useMemo, useState } from 'react';
import { PRODUCT, REVIEWS } from '../../data/product';
import { StarRating } from '../ui/StarRating';
import { Reveal } from '../ui/Reveal';

const PAGE = 6;
const dateFormat = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

type Filter = 'all' | 5 | 4;

/** G: opiniones de clientes (contenido de demostración, ver nota). */
export function ReviewsSection() {
  const [visible, setVisible] = useState(PAGE);
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => (filter === 'all' ? REVIEWS : REVIEWS.filter((r) => r.rating === filter)), [filter]);
  const shown = list.slice(0, visible);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="border-t border-ink/[0.08] pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="page-width">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id="reviews-title" className="h-section">
            Opiniones de clientes
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <StarRating rating={PRODUCT.rating} size={22} />
            <p className="text-[16px] font-semibold tracking-[0.04em]">
              {PRODUCT.rating} / 5 · {PRODUCT.reviewCount} reseñas
            </p>
          </div>
          <p className="mt-2 max-w-[560px] text-[12px] leading-relaxed text-ink/55">
            Contenido de demostración: reseñas mostradas tal como aparecen en la página de referencia. Conecta aquí tu app
            de reseñas verificadas antes de publicar.
          </p>

          <div className="mt-6 flex gap-2" role="group" aria-label="Filtrar reseñas">
            {(
              [
                ['all', 'Todas'],
                [5, '5 estrellas'],
                [4, '4 estrellas'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={filter === value}
                onClick={() => {
                  setFilter(value);
                  setVisible(PAGE);
                }}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  filter === value ? 'border-ink bg-ink text-white' : 'border-ink/25 bg-white hover:border-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r, i) => (
            <li
              key={r.author}
              style={{ animationDelay: `${(i % PAGE) * 50}ms` }}
              className="flex animate-fade-in flex-col rounded-media bg-white p-5 shadow-[0_0_15px_rgba(17,17,17,0.08)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <StarRating rating={r.rating} size={15} />
                <span className="text-[12px] text-ink/50">{r.rating}/5</span>
              </div>
              <p className="mt-3 flex-1 text-[15px] leading-[1.65] tracking-[0.02em]">“{r.body}”</p>
              <div className="mt-4 flex items-center gap-3 border-t border-ink/[0.08] pt-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yc font-heading text-[14px] font-extrabold"
                  aria-hidden
                >
                  {r.author.charAt(0)}
                </span>
                <div className="min-w-0 text-[13px] leading-tight">
                  <p className="font-bold">{r.author}</p>
                  <p className="text-ink/55">
                    {dateFormat.format(new Date(r.date))} · Yellow Club – Lengua fuera
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {visible < list.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="inline-flex min-h-[48px] items-center rounded-button border border-ink bg-white px-8 text-[14px] font-bold tracking-[0.08em] transition-colors hover:bg-ink hover:text-white"
            >
              VER MÁS RESEÑAS ({list.length - visible})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
