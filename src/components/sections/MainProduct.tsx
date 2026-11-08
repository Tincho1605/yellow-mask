import { ProductGallery } from '../product/ProductGallery';
import { ProductInfo } from '../product/ProductInfo';

/** Ficha de producto: galería (izq.) + información y compra (der.). */
export function MainProduct() {
  return (
    <section id="product" aria-label="Producto" className="pt-3 pb-6 md:pt-[14px] md:pb-9">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-[14px] px-3 md:px-[50px] lg:grid-cols-[minmax(0,700fr)_minmax(0,535fr)] lg:gap-[65px]">
        <ProductGallery />
        <ProductInfo />
      </div>
    </section>
  );
}
