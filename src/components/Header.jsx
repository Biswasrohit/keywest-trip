import { useState, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { tripInfo } from '../data/itinerary';
import NamePicker from './NamePicker';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const tripStart = new Date('2026-01-10T12:48:00');
  const tripEnd = new Date('2026-01-15T23:59:59');

  function getTimeLeft() {
    const now = new Date();
    const start = new Date('2026-01-10T12:48:00');
    const end = new Date('2026-01-15T23:59:59');

    if (now >= end) {
      return { status: 'ended' };
    }

    if (now >= start) {
      return { status: 'active' };
    }

    const diff = start - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { status: 'countdown', days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.status === 'ended') {
    return (
      <div className="text-center">
        <p className="text-sand-100 text-sm">Hope you had a blast!</p>
        <p className="text-white text-lg font-semibold">Trip Complete</p>
      </div>
    );
  }

  if (timeLeft.status === 'active') {
    return (
      <div className="text-center">
        <p className="text-sand-100 text-sm">Trip in progress!</p>
        <p className="text-white text-lg font-semibold animate-pulse">Enjoy Key West!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sand-100 text-sm mb-1">Countdown to Paradise</p>
      <div className="flex gap-3 justify-center">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hrs' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
              <span className="text-white text-xl font-bold">{item.value}</span>
            </div>
            <span className="text-sand-100 text-xs mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const { currentUser, setShowPicker, showPicker } = useUser();

  return (
    <header className="bg-gradient-to-r from-ocean-600 to-ocean-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo / Title */}
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl text-white drop-shadow-lg">
              Key West 2026
            </h1>
            <p className="text-ocean-100 text-sm">
              Jan 10-15 • {tripInfo.homeBase}
            </p>
          </div>

          {/* Countdown */}
          <CountdownTimer />

          {/* User Picker */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all"
            >
              <User size={18} />
              <span>{currentUser || 'Select Name'}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {showPicker && <NamePicker />}
    </header>
  );
}
