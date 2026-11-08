import { useEffect, useState } from 'react';
import { ANNOUNCEMENTS } from '../../data/product';
import { useRouter } from '../../context/RouterContext';

const INTERVAL = 3800;

/** Barra negra con mensajes rotativos (fade + slide vertical), como la referencia. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      role="region"
      aria-label="Promociones Yellow Club"
      className="relative flex min-h-9 items-center justify-center overflow-hidden bg-ink px-4 md:min-h-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {ANNOUNCEMENTS.map((text, i) => {
        const state = i === index ? 'active' : i === (index - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length ? 'leaving' : 'idle';
        return (
          <a
            key={text}
            href="#/comprar"
            onClick={(e) => {
              e.preventDefault();
              navigate('/comprar');
            }}
            aria-hidden={state !== 'active'}
            tabIndex={state === 'active' ? 0 : -1}
            className={`absolute inset-x-4 inset-y-0 flex items-center justify-center whitespace-nowrap text-center text-[12px] font-extrabold tracking-[0.08em] text-white no-underline transition-all duration-[450ms] ease-out md:text-[13px] ${
              state === 'active'
                ? 'translate-y-0 opacity-100'
                : state === 'leaving'
                  ? 'pointer-events-none -translate-y-2.5 opacity-0'
                  : 'pointer-events-none translate-y-2.5 opacity-0'
            }`}
          >
            {text}
          </a>
        );
      })}
    </div>
  );
}
