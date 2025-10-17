import { useState } from 'react';
import { CreditCard, Building2, Calendar, MapPin, Ticket, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface PaymentPageProps {
  onNavigate: (page: string, orderNumber?: string) => void;
}

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BE-${timestamp}-${randomStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.length === 0) {
      onNavigate('cart');
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();
      const totalAmount = getTotalPrice();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || null,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        ticket_category_id: item.ticketId,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('ticket_categories')
          .update({
            available_quantity: supabase.rpc('decrement_quantity', {
              ticket_id: item.ticketId,
              amount: item.quantity,
            }),
          })
          .eq('id', item.ticketId);

        if (updateError) console.error('Error updating quantity:', updateError);
      }

      clearCart();
      onNavigate('confirmation', orderNumber);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
            <p className="text-slate-600 mb-8">
              Ajoutez des billets avant de procéder au paiement
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Paiement sécurisé</h1>
          <p className="text-slate-600">Finalisez votre réservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span>Informations de contact</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Jean Dupont"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="jean.dupont@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </form>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span>Informations de paiement</span>
              </h2>

              <div className="bg-white rounded-lg p-5 mb-4">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Coordonnées bancaires pour le virement :
                </h3>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Titulaire du compte :</span>
                    <span className="font-bold">Kustner Cyndie</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">IBAN :</span>
                    <span className="font-mono text-sm">FR76 1659 8000 0140 0005 3206 895</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">BIC/Swift :</span>
                    <span className="font-mono">FPELFR21XXX</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>Important :</strong> Veuillez effectuer le virement avec la référence
                  de votre commande. Une fois le paiement confirmé, vos billets vous seront
                  envoyés par email sous 24-48h.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Votre commande</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.ticketId} className="pb-4 border-b">
                    <div className="flex items-start space-x-2 mb-2">
                      <Ticket className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {item.categoryName}
                        </h3>
                        <div className="text-xs text-slate-600 space-y-0.5 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.city}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span className="capitalize text-xs">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.quantity} × {item.price.toFixed(2)} €
                      </span>
                      <span className="font-semibold text-slate-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all text-lg"
              >
                {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
              </button>

              <button
                onClick={() => onNavigate('cart')}
                disabled={loading}
                className="w-full mt-3 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 py-3 rounded-xl font-medium transition-colors"
              >
                Retour au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
