import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useUI } from '../../context/UIContext';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

/** Enlace interno del router por hash. `/buscar` abre el buscador. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const { openSearch } = useUI();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (to === '/buscar') openSearch();
    else navigate(to);
  };
  return (
    <a href={`#${to}`} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
