import { asset } from '../../lib/asset';
import { useEffect, useRef, useState } from 'react';
import { MAIN_MENU } from '../../data/navigation';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { useUI } from '../../context/UIContext';
import { Link } from '../ui/Link';
import { AccountIcon, CartIcon, CloseIcon, MenuIcon, SearchIcon } from '../ui/Icons';
import { MobileMenu } from './MobileMenu';

function useActiveLabel(): string {
  const { path } = useRouter();
  if (path === '/contacto') return 'Contacto';
  if (path === '/preguntas-frecuentes') return 'Preguntas frecuentes';
  if (path === '/' || path === '/comprar' || path === '/opiniones') return 'Comprar';
  return '';
}

/** Oculta la cabecera al bajar y la muestra al subir (Dawn "on scroll up"). */
function useHideOnScroll(ref: React.RefObject<HTMLElement | null>) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = ref.current?.offsetHeight ?? 100;
      if (y > last.current && y > h * 2) setHidden(true);
      else if (y < last.current) setHidden(false);
      last.current = Math.max(0, y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return hidden;
}

export function Header() {
  const { totals, open: openCart, addSignal } = useCart();
  const { openSearch, menuOpen, setMenuOpen } = useUI();
  const active = useActiveLabel();
  const ref = useRef<HTMLElement>(null);
  const hidden = useHideOnScroll(ref);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (!addSignal) return;
    setBump(true);
    const id = window.setTimeout(() => setBump(false), 500);
    return () => window.clearTimeout(id);
  }, [addSignal]);

  const iconBtn =
    'relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-200 hover:scale-110';

  return (
    <>
      <header
        id="site-header"
        ref={ref}
        className={`sticky top-0 z-40 border-b border-ink/[0.06] bg-white transition-transform duration-300 ease-out ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="page-width grid grid-cols-[1fr_auto_1fr] items-center py-1 lg:grid-cols-[auto_1fr_auto] lg:py-2">
          {/* Menú móvil */}
          <div className="lg:hidden">
            <button
              type="button"
              className={`${iconBtn} -ml-2.5`}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          <Link to="/" className="block justify-self-center px-1 py-0.5 lg:justify-self-start" aria-label="Yellow Club – Inicio">
            <img
              src={asset('images/yellow-club-header-logo.webp')}
              alt="Yellow Club"
              width={220}
              height={68}
              className="h-auto w-[150px] max-w-[44vw] min-[421px]:w-[170px] min-[421px]:max-w-[46vw] lg:w-[min(220px,32vw)]"
            />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block lg:pl-8">
            <ul className="flex flex-wrap">
              {MAIN_MENU.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    aria-current={active === item.label ? 'page' : undefined}
                    className={`group relative inline-block px-[19px] py-2 text-[15px] tracking-[0.06em] no-underline transition-colors ${
                      active === item.label ? 'font-bold text-ink' : 'text-ink/75 hover:text-ink'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-[19px] bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end lg:gap-1">
            <button type="button" className={iconBtn} aria-label="Buscar" onClick={openSearch}>
              <SearchIcon />
            </button>
            <Link to="/cuenta" className={`${iconBtn} hidden lg:flex`} aria-label="Iniciar sesión">
              <AccountIcon />
            </Link>
            <button
              type="button"
              className={`${iconBtn} -mr-2.5 lg:mr-0`}
              aria-label={`Carrito, ${totals.itemCount} ${totals.itemCount === 1 ? 'artículo' : 'artículos'}`}
              onClick={openCart}
            >
              <CartIcon />
              {totals.itemCount > 0 && (
                <span
                  key={addSignal}
                  className={`absolute right-1 bottom-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-yc px-1 text-[10.5px] leading-none font-bold tracking-normal text-ink ring-2 ring-white ${
                    bump ? 'animate-pop' : ''
                  }`}
                >
                  {totals.itemCount > 99 ? '99+' : totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu active={active} />
    </>
  );
}
