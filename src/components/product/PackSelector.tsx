import { useId } from 'react';
import { FACES, FACE_BY_ID, PACKS, packSavings, type FaceId, type Pack } from '../../data/product';
import { useProduct } from '../../context/ProductContext';
import { formatMoney } from '../../lib/money';

interface PackSelectorProps {
  /** Índices de piezas sin elegir del pack activo (tras intentar agregar). */
  invalid: number[];
  onPickChange: () => void;
}

function FacePicker({
  id,
  index,
  value,
  invalid,
  onChange,
}: {
  id: string;
  index: number;
  value: FaceId | null;
  invalid: boolean;
  onChange: (v: FaceId | null) => void;
}) {
  const face = value ? FACE_BY_ID[value] : null;
  return (
    <div>
      <label htmlFor={id} className="mb-[5px] block text-[10.5px] leading-tight font-bold tracking-[0.04em]">
        Cara #{index + 1}
      </label>
      <div className="relative">
        <span
          className={`pointer-events-none absolute top-1/2 left-[7px] flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${
            face ? 'bg-white ring-1 ring-ink/10' : 'border border-dashed border-ink/30 text-[12px] font-bold text-ink/40'
          }`}
          aria-hidden
        >
          {face ? (
            <img key={face.id} src={face.image} alt="" className="h-full w-full animate-fade-in object-cover" />
          ) : (
            '?'
          )}
        </span>
        <select
          id={id}
          data-face-select
          value={value ?? ''}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(e) => onChange((e.target.value || null) as FaceId | null)}
          className={`select-chevron min-h-[42px] w-full rounded-input border bg-white py-[9px] pl-[46px] text-[15px] tracking-[0.02em] transition-[border-color,box-shadow] duration-200 outline-none focus:border-ink focus:shadow-[0_0_0_1px_#111] ${
            invalid ? 'border-sale shadow-[0_0_0_1px_#d72c0d]' : 'border-ink/30 hover:border-ink/60'
          } ${value ? 'text-ink' : 'text-ink/55'}`}
        >
          <option value="" disabled>
            Elige una cara
          </option>
          {FACES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      {invalid && (
        <p id={`${id}-error`} className="mt-1 text-[12px] leading-tight font-semibold text-sale">
          Elige la cara de esta pieza
        </p>
      )}
    </div>
  );
}

function PackOption({ pack, invalid, onPickChange }: { pack: Pack; invalid: number[]; onPickChange: () => void }) {
  const { packId, selectPack, picks, setPick } = useProduct();
  const uid = useId();
  const active = packId === pack.id;
  const savings = packSavings(pack);
  const subtitle = pack.subtitle ?? `Ahorra ${formatMoney(savings)}`;

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('select, label[for]')) return;
        selectPack(pack.id);
      }}
      className={`relative cursor-pointer rounded-2xl border-2 px-[14px] py-[13px] transition-[border-color,background-color,box-shadow,transform] duration-200 md:px-[14px] md:py-[13.5px] ${
        active
          ? 'border-yc bg-yc/[0.08] shadow-[inset_0_0_0_1px_#ffd314]'
          : 'border-ink/[0.18] hover:-translate-y-px hover:border-ink/[0.42]'
      }`}
    >
      {pack.badge && (
        <span
          className={`absolute -top-[8px] right-[11px] rounded-full px-[7px] py-[3px] text-[10.5px] leading-none font-extrabold tracking-[0.03em] uppercase transition-transform duration-200 ${
            pack.badge.tone === 'dark' ? 'bg-ink text-yc' : 'bg-yc text-ink'
          } ${active ? 'scale-105' : ''}`}
        >
          {pack.badge.label}
        </span>
      )}

      <label className="grid cursor-pointer grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-[9px]">
        <input
          type="radio"
          name="crew-pack"
          value={pack.id}
          checked={active}
          onChange={() => selectPack(pack.id)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`grid h-5 w-5 place-items-center rounded-full border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
            active ? 'border-ink' : 'border-ink/45'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full bg-ink transition-transform duration-200 ${active ? 'scale-100' : 'scale-0'}`} />
        </span>
        <span className="min-w-0">
          <span className="block font-heading text-[14.8px] leading-[1.1] font-extrabold tracking-[0.06em] md:text-[16.5px]">
            {pack.name}
          </span>
          <span className="mt-[3px] block text-[12.5px] leading-snug text-ink/65">{subtitle}</span>
        </span>
        <span className="text-right whitespace-nowrap">
          <strong className="block text-[15px] font-bold text-ink/90 md:text-[17.5px]">{formatMoney(pack.price)}</strong>
          {pack.compareAtPrice > pack.price && (
            <s className="text-[12px] text-ink/55">{formatMoney(pack.compareAtPrice)}</s>
          )}
        </span>
      </label>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden" inert={!active} data-pack-panel={pack.id}>
          <div className="mt-[11px] grid grid-cols-1 gap-[7.5px] border-t border-ink/[0.12] pt-[10px] min-[750px]:grid-cols-2">
            {picks[pack.id].map((value, i) => (
              <FacePicker
                key={i}
                id={`${uid}-face-${i}`}
                index={i}
                value={value}
                invalid={active && invalid.includes(i)}
                onChange={(v) => {
                  setPick(pack.id, i, v);
                  onPickChange();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** "ARMA TU CREW": packs de 1 a 4 piezas con cara independiente por pieza. */
export function PackSelector({ invalid, onPickChange }: PackSelectorProps) {
  return (
    <fieldset className="mt-[11px] mb-[10px] md:mt-5">
      <legend className="mb-[9px] flex w-full items-center gap-2.5 font-heading text-[13.5px] font-extrabold tracking-[0.06em] md:mb-3 md:text-[16px]">
        <span aria-hidden className="h-0.5 flex-1 bg-yc" />
        ARMA TU CREW
        <span aria-hidden className="h-0.5 flex-1 bg-yc" />
      </legend>
      <div className="space-y-[9px]">
        {PACKS.map((pack) => (
          <PackOption key={pack.id} pack={pack} invalid={invalid} onPickChange={onPickChange} />
        ))}
      </div>
    </fieldset>
  );
}
