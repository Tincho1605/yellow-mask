import { useMemo, useState } from 'react';
import { FACES, FAQS, PACKS, packSavings } from '../../data/product';
import { POLICY_LINKS } from '../../data/navigation';
import { useProduct } from '../../context/ProductContext';
import { useRouter } from '../../context/RouterContext';
import { useUI } from '../../context/UIContext';
import { useModal } from '../../hooks/useModal';
import { formatMoney } from '../../lib/money';
import { CloseIcon, SearchIcon } from '../ui/Icons';

interface Result {
  id: string;
  group: 'Caras' | 'Packs' | 'Preguntas frecuentes' | 'Páginas';
  title: string;
  subtitle: string;
  image?: string;
  keywords: string;
  run: () => void;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const SUGGESTIONS = ['goggles', 'pack', 'sonrisa', 'chomp', 'envío'];

/** Buscador predictivo sobre caras, packs, FAQ y páginas de la tienda. */
export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const { navigate } = useRouter();
  const { selectFace, selectPack } = useProduct();
  const [query, setQuery] = useState('');
  const ref = useModal<HTMLDivElement>(searchOpen, closeSearch);

  const index = useMemo<Result[]>(() => {
    const go = (fn: () => void, to: string) => () => {
      fn();
      closeSearch();
      setQuery('');
      navigate(to);
    };
    return [
      ...FACES.map((f) => ({
        id: f.id,
        group: 'Caras' as const,
        title: `Yellow Club – ${f.name}`,
        subtitle: f.description,
        image: f.image,
        keywords: `${f.name} ${f.description} pasamontañas cara expresion mascara`,
        run: go(() => selectFace(f.id), '/comprar'),
      })),
      ...PACKS.map((p) => ({
        id: p.id,
        group: 'Packs' as const,
        title: p.name,
        subtitle:
          p.quantity === 1
            ? `${formatMoney(p.price)} · Precio de lanzamiento`
            : `${p.quantity} piezas · ${formatMoney(p.price)} · Ahorra ${formatMoney(packSavings(p))}`,
        keywords: `${p.name} pack crew ${p.quantity} piezas descuento oferta ${p.badge?.label ?? ''}`,
        run: go(() => selectPack(p.id), '/comprar'),
      })),
      ...FAQS.map((q, i) => ({
        id: `faq-${i}`,
        group: 'Preguntas frecuentes' as const,
        title: q.question,
        subtitle: q.answer,
        keywords: `${q.question} ${q.answer}`,
        run: go(() => undefined, '/preguntas-frecuentes'),
      })),
      { id: 'contacto', group: 'Páginas' as const, title: 'Contacto', subtitle: 'Escríbenos', keywords: 'contacto ayuda correo mensaje', run: go(() => undefined, '/contacto') },
      ...POLICY_LINKS.map((l) => ({
        id: l.to,
        group: 'Páginas' as const,
        title: l.label,
        subtitle: 'Políticas de la tienda',
        keywords: `${l.label} politica envio envios reembolso devolucion terminos legal`,
        run: go(() => undefined, l.to),
      })),
    ];
  }, [closeSearch, navigate, selectFace, selectPack]);

  const q = normalize(query.trim());
  const results = q
    ? index.filter((r) => q.split(/\s+/).every((term) => normalize(`${r.title} ${r.keywords}`).includes(term)))
    : [];
  const groups = [...new Set(results.map((r) => r.group))];

  return (
    <div className={`fixed inset-0 z-[60] ${searchOpen ? '' : 'pointer-events-none'}`} aria-hidden={!searchOpen}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeSearch}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en la tienda"
        inert={!searchOpen}
        className={`relative max-h-[85vh] overflow-y-auto bg-white transition-all duration-300 ease-out ${
          searchOpen ? 'visible translate-y-0 opacity-100 shadow-xl' : 'invisible -translate-y-4 opacity-0'
        }`}
      >
        <div className="page-width py-5">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              results[0]?.run();
            }}
            className="flex items-center gap-3"
          >
            <label className="relative flex flex-1 items-center">
              <span className="sr-only">Buscar</span>
              <input
                data-autofocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar caras, packs, preguntas…"
                className="h-[52px] w-full rounded-[10px] border border-ink/55 bg-white pr-12 pl-4 text-[16px] tracking-[0.04em] outline-none transition-shadow focus:shadow-[0_0_0_2px_#111]"
                autoComplete="off"
              />
              <SearchIcon className="pointer-events-none absolute right-4 text-ink/60" width={20} height={20} />
            </label>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
            >
              <CloseIcon />
            </button>
          </form>

          <div aria-live="polite" className="mt-4">
            {!q && (
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink/70">
                <span>Sugerencias:</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-ink/15 px-3 py-1 transition-colors hover:border-ink hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {q && results.length === 0 && (
              <p className="py-6 text-center text-ink/70">No se encontraron resultados para “{query}”.</p>
            )}
            {groups.map((g) => (
              <section key={g} className="mb-4">
                <h2 className="mb-1 border-b border-ink/10 pb-1 font-body text-[11px] font-bold tracking-[0.14em] text-ink/55 uppercase">
                  {g}
                </h2>
                <ul>
                  {results
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={r.run}
                          className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-paper"
                        >
                          {r.image && (
                            <img src={r.image} alt="" className="h-12 w-12 shrink-0 rounded-[8px] object-cover" loading="lazy" />
                          )}
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-semibold">{r.title}</span>
                            <span className="block truncate text-[13px] text-ink/65">{r.subtitle}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
