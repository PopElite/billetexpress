import { Calendar, MapPin, Shield, Zap } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnoiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Réservez vos billets
              <span className="block text-blue-400 mt-2">en toute simplicité</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Accédez aux meilleurs événements en France. Places disponibles en privé,
              réservation rapide et sécurisée.
            </p>
            <button
              onClick={() => onNavigate('events')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Voir les événements
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir Billets Express ?
            </h2>
            <p className="text-lg text-slate-600">
              Une expérience de réservation pensée pour vous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Réservation rapide</h3>
              <p className="text-slate-600">
                Sélectionnez vos billets et réservez en quelques clics seulement
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Paiement sécurisé</h3>
              <p className="text-slate-600">
                Vos informations sont protégées par virement bancaire sécurisé
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Partout en France</h3>
              <p className="text-slate-600">
                Des événements dans les plus grandes villes françaises
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Places privées</h3>
              <p className="text-slate-600">
                Accès à des billets disponibles en quantité limitée
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Prêt à réserver vos billets ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Découvrez tous les événements disponibles maintenant
          </p>
          <button
            onClick={() => onNavigate('events')}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Explorer les événements
          </button>
        </div>
      </section>
    </div>
  );
}
