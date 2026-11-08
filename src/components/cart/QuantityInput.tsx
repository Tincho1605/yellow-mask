import { MinusIcon, PlusIcon } from '../ui/Icons';

interface QuantityInputProps {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

export function QuantityInput({ value, max, label, onChange }: QuantityInputProps) {
  const btn =
    'flex h-full w-10 items-center justify-center text-ink transition-colors hover:bg-ink/[0.05] disabled:cursor-not-allowed disabled:opacity-30';
  return (
    <div className="flex h-[42px] w-[124px] items-stretch overflow-hidden rounded-input border border-ink/55" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label={`Reducir cantidad de ${label}`}>
        <MinusIcon />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        aria-label={`Cantidad de ${label}`}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(0, Math.min(max, n)));
        }}
        className="w-full min-w-0 [appearance:textfield] bg-transparent text-center text-[15px] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar cantidad de ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
