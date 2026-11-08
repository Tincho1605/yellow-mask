/**
 * Catálogo del producto. Textos, precios, packs, FAQ y reseñas reproducen la
 * página de referencia: https://yellowclub.store/products/pasamontanas-amarillo-cara-divertida
 *
 * Los precios se guardan en centavos (igual que Shopify) para evitar errores
 * de redondeo en los cálculos del carrito.
 */

export type FaceId = 'lengua-fuera' | 'gran-sonrisa' | 'chomp' | 'sonrisa-picara';

export interface Face {
  id: FaceId;
  name: string;
  description: string;
  image: string;
  alt: string;
  sku: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  /** Cara relacionada (para sincronizar galería y selector). */
  faceId?: FaceId;
}

export interface Pack {
  id: 'pack-1' | 'pack-2' | 'pack-3' | 'pack-4';
  quantity: number;
  name: string;
  /** Texto bajo el nombre ("Precio de lanzamiento" / "Ahorra $ X"). */
  subtitle?: string;
  price: number;
  compareAtPrice: number;
  badge?: { label: string; tone: 'dark' | 'yellow' };
  /** Nombre del descuento automático que se muestra en el carrito. */
  discountTitle?: string;
}

export const CURRENCY = 'MXN';

export const UNIT_PRICE = 44900;
export const UNIT_COMPARE_AT_PRICE = 69900;

export const PRODUCT = {
  handle: 'pasamontanas-amarillo-cara-divertida',
  vendor: 'Yellow Club',
  type: 'Pasamontañas',
  tagline: 'EL FRÍO PASA. TU LOOK SE QUEDA.',
  rating: 4.8,
  ratingLabel: 'Excelente',
  reviewCount: 37,
  benefits: ['📸 Hecho para destacar en fotos', '🏔️ Listo para nieve y montaña', '😎 Dale personalidad a tu equipo'],
  description: [
    'Un pasamontañas amarillo pensado para nieve, senderismo, ski, snowboard y viajes de invierno donde quieres ir abrigado sin desaparecer en todas las fotos.',
    'Cubre cabeza, rostro y cuello, dejando libre la zona de los ojos para combinarlo con goggles o gafas. Elige la cara que más vaya contigo y conviértelo en parte del look de la ruta.',
  ],
  features: [
    'Diseño amarillo llamativo y fotogénico',
    'Compatible con goggles',
    'Cobertura de cabeza, cara y cuello',
    'Ideal para nieve, montaña y viajes de invierno',
  ],
} as const;

export const FACES: Face[] = [
  {
    id: 'lengua-fuera',
    name: 'Lengua fuera',
    description: 'La principal: lengua roja y actitud máxima.',
    image: '/images/yc-tongue-out-product.webp',
    alt: 'Yellow Club Lengua fuera sobre fondo blanco',
    sku: 'YBH-LENGUA',
  },
  {
    id: 'gran-sonrisa',
    name: 'Gran sonrisa',
    description: 'Sonrisa amplia con dientes blancos.',
    image: '/images/yc-big-grin-product.webp',
    alt: 'Yellow Club Gran sonrisa sobre fondo blanco',
    sku: 'YBH-SONRISA',
  },
  {
    id: 'chomp',
    name: 'Chomp',
    description: 'La sonrisa más exagerada del grupo.',
    image: '/images/yc-chomp-product.webp',
    alt: 'Yellow Club Chomp sobre fondo blanco',
    sku: 'YBH-CHOMP',
  },
  {
    id: 'sonrisa-picara',
    name: 'Sonrisa pícara',
    description: 'Una expresión más discreta y ladeada.',
    image: '/images/yc-smirk-product.webp',
    alt: 'Yellow Club Sonrisa pícara sobre fondo blanco',
    sku: 'YBH-PICARA',
  },
];

export const FACE_BY_ID: Record<FaceId, Face> = Object.fromEntries(FACES.map((f) => [f.id, f])) as Record<
  FaceId,
  Face
>;

export const GALLERY: GalleryImage[] = [
  ...FACES.map((f) => ({ src: f.image, alt: f.alt, faceId: f.id })),
  { src: '/images/yellow-mask-06-selfie.webp', alt: 'Selfie con el pasamontañas Yellow Club Lengua fuera' },
];

export const PACKS: Pack[] = [
  {
    id: 'pack-1',
    quantity: 1,
    name: '1 PIEZA',
    subtitle: 'Precio de lanzamiento',
    price: 44900,
    compareAtPrice: 69900,
  },
  {
    id: 'pack-2',
    quantity: 2,
    name: 'DÚO DE CIMA',
    price: 74900,
    compareAtPrice: 89800,
    badge: { label: 'Más vendido', tone: 'dark' },
    discountTitle: 'Pack Dúo de cima',
  },
  {
    id: 'pack-3',
    quantity: 3,
    name: 'CREW DE 3',
    price: 99900,
    compareAtPrice: 134700,
    discountTitle: 'Pack Crew de 3',
  },
  {
    id: 'pack-4',
    quantity: 4,
    name: 'EXPEDICIÓN COMPLETA',
    price: 119900,
    compareAtPrice: 179600,
    badge: { label: 'Mejor oferta', tone: 'yellow' },
    discountTitle: 'Pack Expedición completa',
  },
];

export const PACK_BY_ID = Object.fromEntries(PACKS.map((p) => [p.id, p])) as Record<Pack['id'], Pack>;

/** Ahorro del pack frente a comprar las piezas sueltas a precio unitario. */
export function packSavings(pack: Pack): number {
  return UNIT_PRICE * pack.quantity - pack.price;
}

/** Porcentaje de descuento frente al precio anterior mostrado. */
export function discountPercent(price: number, compareAt: number): number {
  if (compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const ANNOUNCEMENTS = ['OFERTA 30% DE DESCUENTO', 'ELIGE ENTRE 4 EXPRESIONES', 'PACKS PARA TODA LA CREW'];

export const TICKER_ITEMS = ['ELEGANCIA Y COMODIDAD', 'COMPATIBLE CON GOGGLES', '4 CARAS DISPONIBLES'];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: '¿Se puede usar con goggles?',
    answer: 'Sí. La zona de los ojos queda abierta para combinarla con goggles o gafas de nieve.',
  },
  {
    question: '¿Qué zonas cubre?',
    answer: 'Está pensada para cubrir cabeza, gran parte del rostro y cuello, dejando libre la zona de visión.',
  },
  {
    question: '¿Para qué actividades sirve?',
    answer:
      'Es una opción para nieve, ski, snowboard, senderismo y viajes de invierno donde quieras una capa extra y un look muy reconocible.',
  },
  {
    question: '¿Puedo mezclar caras en un pack?',
    answer: 'Sí. En los packs puedes elegir una cara diferente para cada pieza antes de agregar todo al carrito.',
  },
  {
    question: '¿Tengo que usar un código para el descuento del pack?',
    answer: 'No. Al elegir un pack, el descuento correspondiente se aplica automáticamente en el carrito.',
  },
];

export interface Review {
  author: string;
  rating: number;
  body: string;
  date: string;
}

/**
 * Reseñas tal como aparecen (ocultas) en el HTML de la página de referencia.
 * Se muestran como contenido de demostración: reemplázalas por la integración
 * real de reseñas de la tienda (Judge.me, Loox, etc.).
 */
export const REVIEWS: Review[] = [
  { author: 'Angelica M.', rating: 5, body: 'Amo usarla en casa, encantada con la calidad y comodidad.', date: '2026-10-14' },
  { author: 'Miguel Antonio H.', rating: 5, body: 'Super top.', date: '2026-10-14' },
  { author: 'Servando T.', rating: 5, body: 'Fue un regalo para mi esposa y le encanto!', date: '2026-10-14' },
  { author: 'Alitze P.', rating: 5, body: 'Super calientitos en zonas de frio y comodos.', date: '2026-10-14' },
  { author: 'Camilo Andrés M.', rating: 4, body: 'Diseño muy bueno jajaja super recomendado.', date: '2026-10-14' },
  {
    author: 'Cristopher A.',
    rating: 5,
    body: 'Tapa muy bien todas las zonas que indica, queda demasiado cool con los goggles',
    date: '2026-10-14',
  },
  { author: 'Laura Alejandra U.', rating: 4, body: 'Llego bien, en tiempo y forma. Buena tela', date: '2026-10-14' },
  {
    author: 'Daniel S.',
    rating: 5,
    body: 'Super super super contento con mi compra. Diseño increible y queda con todo.',
    date: '2026-10-14',
  },
  {
    author: 'Montserrat H.',
    rating: 4,
    body: 'Cubre muy bien para el frío, buen estilo y tela de buena calidad.',
    date: '2026-10-14',
  },
  {
    author: 'Arturo L.',
    rating: 5,
    body: 'Siempre que salgo con ella me la halagan demasiado, muy buena compra.',
    date: '2026-10-14',
  },
  {
    author: 'Luis Ángel T.',
    rating: 5,
    body: 'Demasiado comoda, para el frio esta increible. La uso de vez en cuando en mi casa jaja',
    date: '2026-10-14',
  },
  {
    author: 'Fátima M.',
    rating: 5,
    body: 'La tela es demasiado cómoda y resistente, totalmente recomendado.',
    date: '2026-10-14',
  },
];
