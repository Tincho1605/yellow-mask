import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  as?: ElementType;
  order?: number;
  className?: string;
  children: ReactNode;
  id?: string;
}

/** Aparición suave al hacer scroll (fade + slide-up), como en la referencia. */
export function Reveal({ as: Tag = 'div', order = 0, className = '', children, id }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-order': order } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
