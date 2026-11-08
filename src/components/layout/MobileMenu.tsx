import { MAIN_MENU } from '../../data/navigation';
import { useUI } from '../../context/UIContext';
import { useModal } from '../../hooks/useModal';
import { Link } from '../ui/Link';
import { AccountIcon, ChevronRight, CloseIcon, SearchIcon } from '../ui/Icons';

/** Menú hamburguesa: panel lateral izquierdo con overlay. */
export function MobileMenu({ active }: { active: string }) {
  const { menuOpen, setMenuOpen, openSearch } = useUI();
  const close = () => setMenuOpen(false);
  const ref = useModal<HTMLDivElement>(menuOpen, close);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div
        id="mobile-menu"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!menuOpen}
        className={`absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col bg-white transition-[transform,visibility] duration-300 ease-out ${
          menuOpen ? 'visible translate-x-0 shadow-2xl' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
          <img src="/images/yellow-club-header-logo.webp" alt="Yellow Club" className="h-auto w-[140px]" />
          <button type="button" onClick={close} aria-label="Cerrar menú" className="flex h-11 w-11 items-center justify-center">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto py-3">
          <ul>
            {MAIN_MENU.map((item, i) => (
              <li
                key={item.label}
                style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : '0ms' }}
                className={`transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}
              >
                <Link
                  to={item.to}
                  onClick={close}
                  aria-current={active === item.label ? 'page' : undefined}
                  className={`flex items-center justify-between px-6 py-[13px] text-[18px] no-underline transition-colors hover:bg-paper ${
                    active === item.label ? 'font-bold' : ''
                  }`}
                >
                  {item.label}
                  <ChevronRight className="text-ink/40" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-ink/10 bg-paper px-6 py-5">
          <button
            type="button"
            onClick={openSearch}
            className="flex w-full items-center gap-3 py-2 text-left text-[15px] text-ink/80 hover:text-ink"
          >
            <SearchIcon width={20} height={20} /> Buscar
          </button>
          <Link
            to="/cuenta"
            onClick={close}
            className="flex items-center gap-3 py-2 text-[15px] text-ink/80 no-underline hover:text-ink"
          >
            <AccountIcon width={20} height={20} /> Iniciar sesión
          </Link>
          <p className="pt-2 text-[13px] text-ink/60">México | MXN $</p>
        </div>
      </div>
    </div>
  );
}
