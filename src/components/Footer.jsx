import { Heart, MapPin, Palmtree } from 'lucide-react';
import { tripInfo, friends } from '../data/itinerary';

export default function Footer() {
  return (
    <footer className="bg-ocean-900/80 backdrop-blur-sm text-white py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* Palm tree decoration */}
          <div className="flex justify-center gap-4 mb-4">
            <Palmtree className="text-palm-400" size={24} />
            <Palmtree className="text-palm-400" size={32} />
            <Palmtree className="text-palm-400" size={24} />
          </div>

          {/* Trip info */}
          <h3 className="font-display text-2xl mb-2">Key West 2026</h3>
          <p className="text-ocean-200 flex items-center justify-center gap-2">
            <MapPin size={16} />
            {tripInfo.destination}
          </p>

          {/* Friends */}
          <div className="mt-4">
            <p className="text-ocean-300 text-sm mb-2">The Crew:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {friends.map((friend) => (
                <span
                  key={friend}
                  className="bg-ocean-800 px-3 py-1 rounded-full text-sm"
                >
                  {friend}
                </span>
              ))}
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-8 pt-4 border-t border-ocean-800">
            <p className="text-ocean-400 text-sm flex items-center justify-center gap-1">
              Made with <Heart size={14} className="text-coral-500 fill-coral-500" /> for an epic trip
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
