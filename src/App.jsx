import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import CountdownTimer from './components/CountdownTimer';
import ProgressBar from './components/ProgressBar';
import Itinerary from './components/Itinerary';
import WeatherWidget from './components/WeatherWidget';
import MapSection from './components/MapSection';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen">
        <Header />

        <main>
          {/* Countdown Hero */}
          <section className="py-4">
            <div className="max-w-6xl mx-auto px-4">
              <CountdownTimer />
            </div>
          </section>

          {/* Hero Section with Weather */}
          <section className="py-4">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Welcome Message */}
                <div className="md:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome to Paradise! 🌴
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Get ready for 6 days of sun, fun, and unforgettable memories in Key West.
                    From jet ski tours to deep-sea fishing, karaoke nights to the historic
                    Dry Tortugas - this trip has it all!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-ocean-100 text-ocean-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      🎣 Deep Sea Fishing
                    </div>
                    <div className="bg-sunset-100 text-sunset-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      🚤 Jet Ski Tour
                    </div>
                    <div className="bg-palm-100 text-palm-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      🏰 Fort Jefferson
                    </div>
                    <div className="bg-coral-100 text-coral-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      🎤 Karaoke Night
                    </div>
                  </div>
                </div>

                {/* Weather Widget */}
                <div className="md:col-span-1">
                  <WeatherWidget />
                </div>
              </div>
            </div>
          </section>

          {/* Progress Bar */}
          <ProgressBar />

          {/* Itinerary */}
          <Itinerary />

          {/* Map */}
          <MapSection />

          {/* Photo Gallery */}
          <PhotoGallery />
        </main>

        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
