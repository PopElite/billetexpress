import { CheckCircle, Mail, CreditCard, Calendar, MapPin, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ConfirmationPageProps {
  orderNumber: string;
  onNavigate: (page: string) => void;
}

interface OrderDetails {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    subtotal: number;
    ticket_categories: {
      category_name: string;
      events: {
        city: string;
        venue: string;
        date: string;
      };
    };
  }>;
}

export default function ConfirmationPage({ orderNumber, onNavigate }: ConfirmationPageProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          order_number,
          customer_name,
          customer_email,
          total_amount,
          created_at,
          order_items (
            quantity,
            unit_price,
            subtotal,
            ticket_categories (
              category_name,
              events (
                city,
                venue,
                date
              )
            )
          )
        `)
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setOrderDetails(data as OrderDetails);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Commande confirmée !</h1>
            <p className="text-green-100 text-lg">
              Merci pour votre réservation
            </p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Prochaines étapes
                  </h2>
                  <p className="text-slate-700 mb-3">
                    Veuillez effectuer le virement bancaire avec les informations ci-dessous.
                    Une fois le paiement confirmé, vos billets vous seront envoyés par email à
                    l'adresse <strong>{orderDetails?.customer_email}</strong> sous 24-48h.
                  </p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Informations de virement :
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-slate-600">Titulaire :</span>
                        <span className="font-semibold">Kustner Cyndie</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-slate-600">IBAN :</span>
                        <span className="font-mono text-xs sm:text-sm">
                          FR76 1659 8000 0140 0005 3206 895
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-slate-600">BIC/Swift :</span>
                        <span className="font-mono">FPELFR21XXX</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-600">Référence :</span>
                        <span className="font-bold text-blue-600">{orderNumber}</span>
                      </div>
                      <div className="flex justify-between py-1.5 bg-slate-50 -mx-4 px-4 rounded">
                        <span className="text-slate-900 font-semibold">Montant :</span>
                        <span className="font-bold text-lg text-slate-900">
                          {orderDetails?.total_amount.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {orderDetails && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Récapitulatif de votre commande
                  </h2>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600">Numéro de commande :</span>
                        <p className="font-semibold text-slate-900">{orderDetails.order_number}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Date de commande :</span>
                        <p className="font-semibold text-slate-900">
                          {new Date(orderDetails.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600">Nom :</span>
                        <p className="font-semibold text-slate-900">{orderDetails.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Email :</span>
                        <p className="font-semibold text-slate-900">{orderDetails.customer_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {orderDetails.order_items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Ticket className="w-5 h-5 text-blue-600" />
                              <h3 className="font-semibold text-slate-900">
                                {item.ticket_categories.category_name}
                              </h3>
                            </div>
                            <div className="text-sm text-slate-600 space-y-1">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {item.ticket_categories.events.city} -{' '}
                                  {item.ticket_categories.events.venue}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span className="capitalize">
                                  {formatDate(item.ticket_categories.events.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-slate-600">
                              {item.quantity} × {item.unit_price.toFixed(2)} €
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              {item.subtotal.toFixed(2)} €
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-slate-900">Total</span>
                      <span className="text-3xl font-bold text-blue-600">
                        {orderDetails.total_amount.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Voir d'autres événements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
