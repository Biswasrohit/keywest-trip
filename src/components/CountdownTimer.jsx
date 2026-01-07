import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

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
      <div className="text-center py-8">
        <p className="text-white/80 text-lg mb-2">Hope you had a blast!</p>
        <p className="text-white text-3xl font-bold">Trip Complete</p>
      </div>
    );
  }

  if (timeLeft.status === 'active') {
    return (
      <div className="text-center py-8">
        <p className="text-white/80 text-lg mb-2">Trip in progress!</p>
        <p className="text-white text-3xl font-bold animate-pulse">Enjoy Key West!</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-white/80 text-lg mb-4">Countdown to Paradise</p>
      <div className="flex gap-4 justify-center flex-wrap">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 min-w-[80px]">
              <span className="text-white text-4xl font-bold">{item.value}</span>
            </div>
            <span className="text-white/80 text-sm mt-2 block">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
