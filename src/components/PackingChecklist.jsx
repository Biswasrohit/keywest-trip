import { useState } from 'react';
import { Backpack, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { packingCategories, getTotalItemCount } from '../data/packing';
import { friends } from '../data/itinerary';
import { usePackingChecklist } from '../hooks/usePackingChecklist';
import { useUser } from '../context/UserContext';
import PackingCategory from './PackingCategory';

// Color mapping for each friend
const friendColors = {
  Rohit: 'bg-ocean-500',
  Alex: 'bg-palm-500',
  Prosin: 'bg-sunset-500',
  Lucas: 'bg-coral-500',
  Matthew: 'bg-purple-500',
};

export default function PackingChecklist() {
  const [expanded, setExpanded] = useState(false);
  const { getUserProgress, loading } = usePackingChecklist();
  const { currentUser, setShowPicker } = useUser();

  const totalItems = getTotalItemCount();

  // Get progress for each friend
  const friendProgress = friends.map(friend => ({
    name: friend,
    ...getUserProgress(friend, totalItems),
  }));

  // Current user's progress
  const currentProgress = currentUser
    ? getUserProgress(currentUser, totalItems)
    : { packed: 0, total: totalItems };

  const overallProgress = currentUser
    ? (currentProgress.packed / currentProgress.total) * 100
    : 0;

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-ocean-500 border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
            <Backpack className="text-white" />
            Packing Checklist
          </h2>
          <p className="text-white/80 mt-2">
            {totalItems} items to pack • Everyone tracks their own progress
          </p>
        </div>

        {/* Main Collapsible Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {/* Header - Always Visible */}
          <button
            onClick={() => {
              if (!currentUser) {
                setShowPicker(true);
                return;
              }
              setExpanded(!expanded);
            }}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
              <Backpack size={28} className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-gray-800">
                {currentUser ? `${currentUser}'s Packing List` : 'Select Your Name'}
              </h3>
              {currentUser ? (
                <div className="text-sm text-gray-600">
                  {currentProgress.packed} of {currentProgress.total} items packed
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Tap to select your name and start tracking
                </div>
              )}
            </div>

            {/* Progress Circle */}
            {currentUser && (
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#22c55e"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${overallProgress * 1.256} 125.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
              </div>
            )}

            {/* Expand Icon */}
            <div className="text-gray-400">
              {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </button>

          {/* Friend Progress Badges */}
          <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
            <Users size={16} className="text-gray-400" />
            {friendProgress.map(({ name, packed, total }) => (
              <div
                key={name}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  name === currentUser
                    ? `${friendColors[name]} text-white`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="font-medium">{name.charAt(0)}</span>
                <span>{packed}/{total}</span>
              </div>
            ))}
          </div>

          {/* Expanded Content - Categories */}
          {expanded && currentUser && (
            <div className="p-4 pt-0 space-y-3 bg-gray-50">
              {packingCategories.map((category, index) => (
                <PackingCategory
                  key={category.id}
                  category={category}
                  isExpanded={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
