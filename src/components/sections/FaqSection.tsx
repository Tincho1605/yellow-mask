import { FAQS } from '../../data/product';
import faqIcons from '../../data/faqIcons.json';
import { AccordionItem } from '../ui/Accordion';
import { Reveal } from '../ui/Reveal';

type IconPath = { d: string; evenodd: boolean };

/** Iconos de la referencia: ojo, casilla, pin, corazón y etiqueta. */
function FaqIcon({ paths }: { paths: IconPath[] }) {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} fill="currentColor" aria-hidden focusable="false">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.evenodd ? 'evenodd' : undefined} />
      ))}
    </svg>
  );
}

/** F: preguntas frecuentes con acordeones suaves. */
export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pb-[42px] md:pb-14">
      <div className="mx-auto max-w-[734px] px-[15px]">
        <Reveal className="text-center">
          <h2 id="faq-title" className="h-section">
            Preguntas frecuentes
          </h2>
        </Reveal>
        <Reveal order={1} className="mt-8 border-t border-ink/10">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={item.question}
              icon={<FaqIcon paths={(faqIcons as IconPath[][])[i] ?? []} />}
              titleClassName="font-heading text-[16px] font-bold tracking-[0.06em] md:text-[17px]"
              title={item.question}
            >
              <p className="pl-[30px]">{item.answer}</p>
            </AccordionItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
