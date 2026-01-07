import { User, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { tripInfo } from '../data/itinerary';
import NamePicker from './NamePicker';

export default function Header() {
  const { currentUser, setShowPicker, showPicker } = useUser();

  return (
    <header className="bg-gradient-to-r from-ocean-600 to-ocean-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-white drop-shadow-lg">
              Key West 2026
            </h1>
            <p className="text-ocean-100 text-xs md:text-sm">
              Jan 10-15 • {tripInfo.homeBase}
            </p>
          </div>

          {/* User Picker */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all"
          >
            <User size={18} />
            <span className="hidden sm:inline">{currentUser || 'Select Name'}</span>
            <span className="sm:hidden">{currentUser ? currentUser.split(' ')[0] : 'Name'}</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {showPicker && <NamePicker />}
    </header>
  );
}
