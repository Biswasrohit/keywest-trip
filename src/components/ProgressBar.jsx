import { useActivities } from '../hooks/useActivities';
import { itinerary } from '../data/itinerary';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ProgressBar() {
  const { activityStates } = useActivities();

  // Count total and completed activities
  const totalActivities = itinerary.reduce(
    (sum, day) => sum + day.activities.length,
    0
  );

  const completedActivities = Object.values(activityStates).filter(
    (state) => state?.completed
  ).length;

  const percentage = Math.round((completedActivities / totalActivities) * 100);

  return (
    <section className="py-6">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="text-palm-500" size={20} />
              Trip Progress
            </h3>
            <span className="text-2xl font-bold text-ocean-600">{percentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ocean-500 to-palm-500 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>{completedActivities} completed</span>
            <span>{totalActivities - completedActivities} remaining</span>
          </div>

          {/* Day breakdown */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between gap-2">
              {itinerary.map((day) => {
                const dayCompleted = day.activities.filter(
                  (a) => activityStates[a.id]?.completed
                ).length;
                const dayTotal = day.activities.length;
                const dayPercentage = (dayCompleted / dayTotal) * 100;

                return (
                  <div key={day.day} className="flex-1 text-center">
                    <div className="text-lg mb-1">{day.emoji}</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-palm-500 transition-all"
                        style={{ width: `${dayPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dayCompleted}/{dayTotal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
