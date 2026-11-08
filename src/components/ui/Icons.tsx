import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export const SearchIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...p}>
    <circle cx="10.5" cy="10.5" r="6.75" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const AccountIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...p}>
    <circle cx="12" cy="8" r="4.25" />
    <path d="M4 20.25c.9-3.4 4.1-5.5 8-5.5s7.1 2.1 8 5.5H4Z" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...p}>
    <path d="M4.5 7.5h15l-1 12.25a1.5 1.5 0 0 1-1.5 1.25H7a1.5 1.5 0 0 1-1.5-1.25l-1-12.25Z" />
    <path d="M8.75 9.5V6.75a3.25 3.25 0 0 1 6.5 0V9.5" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={24} height={24} {...p}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={14} height={14} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeft = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={20} height={20} strokeWidth={2} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={20} height={20} strokeWidth={2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={16} height={16} strokeWidth={2} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ZoomIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={18} height={18} {...p}>
    <circle cx="10.5" cy="10.5" r="6.75" />
    <path d="m15.5 15.5 5 5M10.5 7.75v5.5M7.75 10.5h5.5" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={18} height={18} {...p}>
    <path d="M4.5 6.75h15M9.5 6.75V4.5h5v2.25M6.5 6.75l.9 12.5a1.5 1.5 0 0 0 1.5 1.25h6.2a1.5 1.5 0 0 0 1.5-1.25l.9-12.5M10.25 10.5v6.25M13.75 10.5v6.25" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={18} height={18} strokeWidth={2.4} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const TagIcon = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={12} height={12} fill="currentColor" aria-hidden {...p}>
    <path d="M10.3 1.2A1.5 1.5 0 0 1 11.4.8h6.8A1.5 1.5 0 0 1 19.7 2.3v6.8a1.5 1.5 0 0 1-.4 1.1l-8.9 8.9a1.5 1.5 0 0 1-2.1 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.1l8.8-9Zm4.9 6.1a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={14} height={14} strokeWidth={1.8} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={14} height={14} strokeWidth={1.8} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" width={16} height={16} strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.4v.1" />
  </svg>
);
