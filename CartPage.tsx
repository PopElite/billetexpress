import { Trash2, ShoppingCart, Calendar, MapPin, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
            <p className="text-slate-600 mb-8">
              Découvrez nos événements disponibles et réservez vos billets
            </p>
            <button
              onClick={() => onNavigate('events')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Voir les événements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Votre panier</h1>
          <p className="text-slate-600">
            {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.ticketId}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Ticket className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-slate-900">
                        {item.categoryName}
                      </h3>
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {item.city} - {item.venue}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{formatDate(item.date)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <label className="text-sm font-medium text-slate-700">Quantité:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.ticketId, parseInt(e.target.value))}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from(
                          { length: Math.min(item.availableQuantity, 10) },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        onClick={() => removeFromCart(item.ticketId)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Retirer</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">Prix unitaire</div>
                    <div className="text-lg font-medium text-slate-900">
                      {item.price.toFixed(2)} €
                    </div>
                    <div className="text-sm text-slate-500 mt-3 mb-1">Sous-total</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Articles ({getTotalItems()})</span>
                  <span>{getTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('payment')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-lg"
              >
                Procéder au paiement
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
              >
                Continuer mes achats
              </button>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-start space-x-2 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <p>Paiement sécurisé par virement bancaire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
