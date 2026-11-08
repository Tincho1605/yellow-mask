import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from './Icons';

interface AccordionItemProps {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
}

/**
 * Acordeón accesible con animación de altura suave (grid-rows 0fr → 1fr),
 * sin medir el DOM.
 */
export function AccordionItem({ title, icon, children, defaultOpen = false, titleClassName = '' }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-ink/10">
      <h3 className="m-0">
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className={`group flex w-full items-center gap-[10px] py-[14px] text-left transition-colors hover:text-ink/80 ${titleClassName}`}
        >
          {icon && <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>}
          <span className="flex-1">{title}</span>
          <ChevronDown
            className={`shrink-0 transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-[18px] text-[15px] leading-[1.7] text-ink/75">{children}</div>
        </div>
      </div>
    </div>
  );
}
