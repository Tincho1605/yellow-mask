import { useId } from 'react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

const STAR_PATH =
  'M12 2.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.5l-6 3.3 1.3-6.7-5-4.6 6.8-.8L12 2.5Z';

/** Estrellas con relleno parcial (p. ej. 4.8 → la quinta al 80 %). */
export function StarRating({ rating, size = 18, className = '' }: StarRatingProps) {
  const uid = useId();
  return (
    <span className={`inline-flex gap-[2px] ${className}`} role="img" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const gradId = `${uid}-star-${i}`;
        return (
          <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden>
            <defs>
              <linearGradient id={gradId}>
                <stop offset={`${fill * 100}%`} stopColor="#ffc700" />
                <stop offset={`${fill * 100}%`} stopColor="#e3e3df" />
              </linearGradient>
            </defs>
            <path d={STAR_PATH} fill={`url(#${gradId})`} />
          </svg>
        );
      })}
    </span>
  );
}
