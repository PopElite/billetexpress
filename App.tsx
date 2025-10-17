import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [orderNumber, setOrderNumber] = useState('');

  const handleNavigate = (page: string, orderNum?: string) => {
    setCurrentPage(page);
    if (orderNum) {
      setOrderNumber(orderNum);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />

        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'events' && <EventsPage onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'payment' && <PaymentPage onNavigate={handleNavigate} />}
        {currentPage === 'confirmation' && (
          <ConfirmationPage orderNumber={orderNumber} onNavigate={handleNavigate} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;
