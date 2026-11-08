# Yellow Club – Pasamontañas amarillo con cara divertida

Réplica funcional de la página de producto
[yellowclub.store/products/pasamontanas-amarillo-cara-divertida](https://yellowclub.store/products/pasamontanas-amarillo-cara-divertida),
construida con **React 19 + TypeScript + Tailwind CSS v4 + Vite**.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # typecheck + build de producción en dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

## Qué incluye

| Área | Detalle |
| --- | --- |
| Cabecera | Barra de anuncios rotativa, logo, menú, buscador predictivo, cuenta, carrito con contador animado. Se oculta al bajar y reaparece al subir. Menú hamburguesa en móvil. |
| Galería | Imagen principal con transición, miniaturas, flechas, swipe táctil y visor a pantalla completa con zoom (clic/tap y desplazamiento con el puntero, teclado ← → Esc). |
| Ficha | Frase, título dinámico por cara, valoración, precio/precio anterior/% que se actualizan según el pack, beneficios, selector de las 4 caras, descripción. |
| Packs “ARMA TU CREW” | 1 pieza, Dúo de cima (MÁS VENDIDO), Crew de 3, Expedición completa (MEJOR OFERTA). Cada pieza tiene su propio selector de cara; no se puede agregar un pack con caras sin elegir (aviso en rojo y foco en el primer campo faltante). |
| Carrito | Drawer lateral, confirmación al agregar, mosaico de caras, cantidades, eliminar, subtotal, descuentos automáticos por pack, total y persistencia en `localStorage` (también sincronizado entre pestañas). |
| Checkout | Checkout de **demostración** con validación, resumen y página de confirmación (no pide datos de pago ni cobra). |
| Secciones | Presentación + características, ticker, compatibilidad con goggles, “Elige tu expresión” (tarjetas que seleccionan la cara), garantía, FAQ en acordeón, opiniones, footer con ondas animadas, ayuda, políticas y medios de pago. |
| Accesibilidad / SEO | HTML semántico, foco visible, trampas de foco en modales, `aria-*`, `prefers-reduced-motion`, meta/OG tags y JSON-LD de producto. |

## Estructura

```
src/
  data/          catálogo (caras, packs, precios en centavos, FAQ, reseñas) y navegación
  context/       carrito (reducer + localStorage), selección de producto, router por hash, UI
  hooks/         useModal (scroll lock, Escape, focus trap), useInView (animaciones al hacer scroll)
  components/
    layout/      AnnouncementBar, Header, MobileMenu, SearchOverlay, Footer
    product/     ProductGallery, Lightbox, ProductInfo, PackSelector
    cart/        CartDrawer, QuantityInput, LineImage
    sections/    secciones de la página de producto
    pages/       ProductPage, Checkout, confirmación, contacto, cuenta, políticas
public/images    imágenes originales del producto (optimizadas a WebP)
```

## Contenido de demostración

- **Reseñas**: son las que aparecen en el HTML de la página de referencia; se muestran marcadas como demo. Sustitúyelas por tu app de reseñas verificadas.
- **Políticas, contacto, cuenta y checkout**: páginas preparadas y funcionales, con avisos de demo; reemplaza los textos por los oficiales y conecta Shopify antes de publicar.
- **Crew de 3**: la referencia no muestra precio anterior para este pack; aquí se muestra `$ 1,347.00` (3 × $ 449.00) para que sea coherente con el ahorro de `$ 348.00` que ya anuncia.
