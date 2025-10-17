import { useEffect, useState } from 'react';
import { Calendar, MapPin, Ticket, Plus } from 'lucide-react';
import { supabase, EventWithTickets, TicketCategory } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface EventsPageProps {
  onNavigate: (page: string) => void;
}

export default function EventsPage({ onNavigate }: EventsPageProps) {
  const [events, setEvents] = useState<EventWithTickets[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          ticket_categories (*)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data as EventWithTickets[]);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  const groupEventsByVenue = () => {
    const grouped: Record<string, EventWithTickets[]> = {};

    events.forEach((event) => {
      const key = `${event.city} - ${event.venue}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(event);
    });

    return grouped;
  };

  const getCategoryColor = (categoryName: string) => {
    if (categoryName.includes('Catégorie 1')) return 'from-amber-500 to-orange-500';
    if (categoryName.includes('Catégorie 2')) return 'from-blue-500 to-cyan-500';
    if (categoryName.includes('Fosse')) return 'from-green-500 to-emerald-500';
    return 'from-slate-500 to-slate-600';
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.includes('Catégorie 1')) return '⭐';
    if (categoryName.includes('Catégorie 2')) return '🎫';
    if (categoryName.includes('Fosse')) return '🎸';
    return '🎟️';
  };

  const handleAddToCart = (ticket: TicketCategory, event: EventWithTickets) => {
    const quantity = selectedQuantities[ticket.id] || 1;

    addToCart({
      ticketId: ticket.id,
      eventId: event.id,
      city: event.city,
      venue: event.venue,
      date: event.date,
      categoryName: ticket.category_name,
      price: ticket.price,
      quantity,
      availableQuantity: ticket.available_quantity,
    });

    setAddedToCart({ ...addedToCart, [ticket.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [ticket.id]: false });
    }, 2000);
  };

  const groupedEvents = groupEventsByVenue();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            🎟️ Événements disponibles
          </h1>
          <p className="text-lg text-slate-600">
            Sélectionnez vos billets parmi nos places privées
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([venueKey, venueEvents]) => (
            <div
              key={venueKey}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <MapPin className="w-6 h-6" />
                  <span>{venueKey}</span>
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {venueEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold text-slate-800 capitalize">
                        {formatDate(event.date)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.ticket_categories.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getCategoryIcon(ticket.category_name)}</span>
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {ticket.category_name}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {ticket.available_quantity} place{ticket.available_quantity > 1 ? 's' : ''} disponible{ticket.available_quantity > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className={`bg-gradient-to-r ${getCategoryColor(ticket.category_name)} text-white px-4 py-2 rounded-lg text-center font-bold text-lg mb-4`}>
                            {ticket.price.toFixed(2)} €
                          </div>

                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedQuantities[ticket.id] || 1}
                              onChange={(e) =>
                                setSelectedQuantities({
                                  ...selectedQuantities,
                                  [ticket.id]: parseInt(e.target.value),
                                })
                              }
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={ticket.available_quantity === 0}
                            >
                              {Array.from({ length: Math.min(ticket.available_quantity, 10) }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleAddToCart(ticket, event)}
                              disabled={ticket.available_quantity === 0}
                              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 ${
                                addedToCart[ticket.id]
                                  ? 'bg-green-500 text-white'
                                  : ticket.available_quantity === 0
                                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105'
                              }`}
                            >
                              {addedToCart[ticket.id] ? (
                                <>
                                  <span>✓</span>
                                  <span>Ajouté</span>
                                </>
                              ) : ticket.available_quantity === 0 ? (
                                <span>Épuisé</span>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  <span>Réserver</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
          <Ticket className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Prêt à finaliser votre commande ?</h3>
          <p className="text-blue-100 mb-6">
            Consultez votre panier et procédez au paiement sécurisé
          </p>
          <button
            onClick={() => onNavigate('cart')}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all"
          >
            Voir mon panier
          </button>
        </div>
      </div>
    </div>
  );
}
