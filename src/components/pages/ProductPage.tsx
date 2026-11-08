import { FacesSection } from '../sections/FacesSection';
import { FaqSection } from '../sections/FaqSection';
import { GogglesSection } from '../sections/GogglesSection';
import { GuaranteeSection } from '../sections/GuaranteeSection';
import { MainProduct } from '../sections/MainProduct';
import { PresentationSection } from '../sections/PresentationSection';
import { ReviewsSection } from '../sections/ReviewsSection';
import { Ticker } from '../sections/Ticker';

/** Orden de secciones de la página de referencia. */
export function ProductPage() {
  return (
    <>
      <MainProduct />
      <PresentationSection />
      <Ticker />
      <GogglesSection />
      <FacesSection />
      <GuaranteeSection />
      <FaqSection />
      <ReviewsSection />
    </>
  );
}
