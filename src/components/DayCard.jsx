import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { format, parseISO, isToday, isPast, isFuture } from 'date-fns';
import ActivityItem from './ActivityItem';

export default function DayCard({ day, activities, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const date = parseISO(day.date);
  const isCurrent = isToday(date);
  const isComplete = isPast(date) && !isToday(date);
  const isUpcoming = isFuture(date);

  const completedCount = activities?.filter(a => a.completed)?.length || 0;
  const totalCount = day.activities.length;

  return (
    <div
      id={`day-${day.day}`}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all ${
        isCurrent ? 'ring-4 ring-ocean-400 ring-offset-2' : ''
      }`}
    >
      {/* Day Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 flex items-center gap-4 transition-colors ${
          isCurrent
            ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white'
            : isComplete
            ? 'bg-palm-50 text-palm-800'
            : 'bg-sand-50 text-gray-800 hover:bg-sand-100'
        }`}
      >
        {/* Day Number & Emoji */}
        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
          isCurrent
            ? 'bg-white/20'
            : isComplete
            ? 'bg-palm-200'
            : 'bg-sunset-100'
        }`}>
          <span className="text-2xl">{day.emoji}</span>
          <span className={`text-xs font-semibold ${
            isCurrent ? 'text-white' : isComplete ? 'text-palm-700' : 'text-sunset-700'
          }`}>
            Day {day.day}
          </span>
        </div>

        {/* Day Info */}
        <div className="flex-1 text-left">
          <h2 className="text-lg font-bold">{day.title}</h2>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Calendar size={14} />
            <span>{format(date, 'EEEE, MMM d')}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="text-right mr-2">
          <div className="text-sm font-medium">
            {completedCount}/{totalCount}
          </div>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isCurrent ? 'bg-white' : 'bg-palm-500'
              }`}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Expand Icon */}
        <div className={isCurrent ? 'text-white' : 'text-gray-500'}>
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {/* Activities */}
      {expanded && (
        <div className="p-4 space-y-3 bg-gray-50">
          {day.activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              dayDate={day.date}
              isLast={index === day.activities.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
