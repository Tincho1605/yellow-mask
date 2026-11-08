import { useEffect } from 'react';
import { CartDrawer } from './components/cart/CartDrawer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Footer, WaveDivider } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { AccountPage, ContactPage, NotFoundPage, PolicyPage } from './components/pages/InfoPages';
import { OrderConfirmationPage } from './components/pages/OrderConfirmationPage';
import { ProductPage } from './components/pages/ProductPage';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { RouterProvider, SECTION_ROUTES, useRouter } from './context/RouterContext';
import { UIProvider } from './context/UIContext';

const BASE_TITLE = 'Pasamontañas amarillo con cara divertida | Nieve y montaña';

function resolve(path: string): { title: string; node: React.ReactNode } {
  if (path === '/' || SECTION_ROUTES[path]) return { title: BASE_TITLE, node: <ProductPage /> };
  if (path === '/checkout') return { title: 'Finalizar compra – Yellow Club', node: <CheckoutPage /> };
  if (path === '/contacto') return { title: 'Contacto – Yellow Club', node: <ContactPage /> };
  if (path === '/cuenta') return { title: 'Iniciar sesión – Yellow Club', node: <AccountPage /> };
  const order = path.match(/^\/pedido\/([\w-]+)$/);
  if (order) return { title: 'Pedido confirmado – Yellow Club', node: <OrderConfirmationPage number={order[1]} /> };
  const policy = path.match(/^\/politicas\/([\w-]+)$/);
  if (policy) return { title: 'Políticas – Yellow Club', node: <PolicyPage slug={policy[1]} /> };
  return { title: 'Página no encontrada – Yellow Club', node: <NotFoundPage /> };
}

function Routes() {
  const { path } = useRouter();
  const { title, node } = resolve(path);
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {node}
    </main>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <UIProvider>
        <CartProvider>
          <ProductProvider>
            <a
              href="#main"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('main')?.focus();
              }}
              className="sr-only z-[100] rounded bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
            >
              Ir directamente al contenido
            </a>
            <AnnouncementBar />
            <Header />
            <Routes />
            <WaveDivider />
            <Footer />
            <CartDrawer />
            <SearchOverlay />
          </ProductProvider>
        </CartProvider>
      </UIProvider>
    </RouterProvider>
  );
}
