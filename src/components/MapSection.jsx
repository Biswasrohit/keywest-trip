import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useItinerary } from '../context/ItineraryContext';
import { formatTimeToAMPM } from '../utils/timeUtils';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom colored icons for different days
const dayColors = ['#0ea5e9', '#f97316', '#22c55e', '#f43f5e', '#8b5cf6', '#6366f1'];

function createDayIcon(dayIndex) {
  const color = dayColors[dayIndex] || dayColors[0];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="${color}" stroke="#fff" stroke-width="1" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="#fff" cx="12" cy="12" r="5"/>
      <text x="12" y="15" text-anchor="middle" fill="${color}" font-size="8" font-weight="bold">${dayIndex + 1}</text>
    </svg>
  `;
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

export default function MapSection() {
  const { itinerary } = useItinerary();
  const [selectedDay, setSelectedDay] = useState(null);

  // Collect all unique locations
  const locations = useMemo(() => {
    const locs = [];
    const seen = new Set();

    itinerary.forEach((day, dayIndex) => {
      day.activities.forEach((activity) => {
        if (activity.location && !seen.has(activity.location.name)) {
          seen.add(activity.location.name);
          locs.push({
            ...activity.location,
            activity: activity.title,
            day: day.day,
            dayIndex,
            emoji: day.emoji,
            time: activity.time,
            type: activity.type,
          });
        }
      });
    });

    return locs;
  }, [itinerary]);

  // Filter locations by selected day
  const filteredLocations = selectedDay
    ? locations.filter((loc) => loc.day === selectedDay)
    : locations;

  // Key West center
  const center = [24.5551, -81.7800];

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
            <MapPin className="text-white" />
            Trip Map
          </h2>
          <p className="text-white/80 mt-2">
            {locations.length} locations across Key West
          </p>
        </div>

        {/* Day Filter */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedDay(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedDay === null
                ? 'bg-white text-ocean-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            All Days
          </button>
          {itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDay === day.day
                  ? 'bg-white text-ocean-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {day.emoji} Day {day.day}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[400px] md:h-[500px]">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLocations.map((loc, index) => (
                <Marker
                  key={`${loc.name}-${index}`}
                  position={[loc.lat, loc.lng]}
                  icon={createDayIcon(loc.dayIndex)}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">{loc.activity}</div>
                      <div className="text-gray-600">{loc.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {loc.emoji} Day {loc.day} • {formatTimeToAMPM(loc.time)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-4 flex-wrap text-sm text-white/80">
          {itinerary.map((day, index) => (
            <div key={day.day} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dayColors[index] }}
              />
              <span>Day {day.day}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
