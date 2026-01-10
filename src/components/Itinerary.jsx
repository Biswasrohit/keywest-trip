import { useItinerary } from '../context/ItineraryContext';
import { useActivities } from '../hooks/useActivities';
import DayCard from './DayCard';
import { isToday, parseISO } from 'date-fns';

export default function Itinerary() {
  const { itinerary, loading: itineraryLoading } = useItinerary();
  const { activityStates, loading: activitiesLoading } = useActivities();

  // Find which day should be expanded by default
  const todayIndex = itinerary.findIndex((day) => isToday(parseISO(day.date)));
  const defaultExpandedIndex = todayIndex >= 0 ? todayIndex : 0;

  // Count total activities
  const totalActivities = itinerary.reduce((sum, day) => sum + day.activities.length, 0);

  if (itineraryLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            Your Itinerary
          </h2>
          <p className="text-white/80 mt-2">
            {itinerary.length} days • {totalActivities} activities • Endless memories
          </p>
        </div>

        {/* Day Navigation Pills */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {itinerary.map((day) => {
            const isCurrent = isToday(parseISO(day.date));
            return (
              <a
                key={day.day}
                href={`#day-${day.day}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-white text-ocean-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="mr-1">{day.emoji}</span>
                Day {day.day}
              </a>
            );
          })}
        </div>

        {/* Day Cards */}
        <div className="space-y-4">
          {itinerary.map((day, index) => {
            // Get activity states for this day
            const dayActivities = day.activities.map((activity) => ({
              ...activity,
              ...activityStates[activity.id],
            }));

            return (
              <DayCard
                key={day.day}
                day={day}
                dayIndex={index}
                activities={dayActivities}
                isExpanded={index === defaultExpandedIndex}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
