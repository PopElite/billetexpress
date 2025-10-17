import { Ticket, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Ticket className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Billets Express</span>
          </button>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium hover:text-blue-400 transition-colors ${
                currentPage === 'home' ? 'text-blue-400' : ''
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate('events')}
              className={`text-sm font-medium hover:text-blue-400 transition-colors ${
                currentPage === 'events' ? 'text-blue-400' : ''
              }`}
            >
              Événements
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center space-x-1 text-sm font-medium hover:text-blue-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Panier</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
