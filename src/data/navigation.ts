export interface NavLink {
  label: string;
  to: string;
}

export const MAIN_MENU: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Comprar', to: '/comprar' },
  { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
  { label: 'Contacto', to: '/contacto' },
];

export const FOOTER_HELP: NavLink[] = [
  { label: 'Comprar', to: '/comprar' },
  { label: 'Envíos', to: '/politicas/envio' },
  { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Política de privacidad', to: '/politicas/privacidad' },
  { label: 'Buscar', to: '/buscar' },
];

export const POLICY_LINKS: NavLink[] = [
  { label: 'Política de privacidad', to: '/politicas/privacidad' },
  { label: 'Política de reembolso', to: '/politicas/reembolso' },
  { label: 'Términos del servicio', to: '/politicas/terminos' },
  { label: 'Política de envío', to: '/politicas/envio' },
  { label: 'Información de contacto', to: '/politicas/contacto' },
  { label: 'Aviso legal', to: '/politicas/aviso-legal' },
];
