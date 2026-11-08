import { useMemo } from 'react';
import { CheckIcon } from '../ui/Icons';
import { Link } from '../ui/Link';
import { LAST_ORDER_KEY, OrderSummary, type DemoOrder } from './CheckoutPage';

export function OrderConfirmationPage({ number }: { number: string }) {
  const order = useMemo<DemoOrder | null>(() => {
    try {
      const raw = window.localStorage.getItem(LAST_ORDER_KEY);
      const parsed = raw ? (JSON.parse(raw) as DemoOrder) : null;
      return parsed?.number === number ? parsed : null;
    } catch {
      return null;
    }
  }, [number]);

  if (!order) {
    return (
      <div className="page-width py-20 text-center">
        <h1 className="h-section">Pedido no encontrado</h1>
        <Link to="/" className="mt-6 inline-flex min-h-[50px] items-center rounded-button bg-yc px-8 font-bold">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="page-width max-w-[760px] py-12 md:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-yc">
          <CheckIcon width={30} height={30} />
        </span>
        <p className="mt-5 text-[13px] font-bold tracking-[0.12em] text-ink/60">PEDIDO {order.number}</p>
        <h1 className="h-section mt-1">¡Gracias, {order.name.split(' ')[0]}!</h1>
        <p className="mt-3 max-w-[520px] text-ink/75">
          Tu pedido de demostración se registró correctamente. En una tienda conectada a Shopify, aquí recibirías la
          confirmación en <strong>{order.email}</strong>.
        </p>
      </div>
      <div className="mt-10 rounded-media bg-paper p-6">
        <h2 className="mb-4 font-heading text-[20px] font-extrabold">Resumen</h2>
        <OrderSummary lines={order.lines} totals={order.totals} />
        <p className="mt-5 border-t border-ink/10 pt-4 text-[14px] text-ink/75">
          <strong className="text-ink">Envío a:</strong> {order.address}
        </p>
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/comprar"
          className="inline-flex min-h-[52px] items-center rounded-button bg-yc px-8 font-bold transition-transform hover:-translate-y-px"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
