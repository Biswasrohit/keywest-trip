import {
  Plane, MapPin, Utensils, Waves, Music, Clock, Bike,
  CheckCircle2, Circle, Star, Shirt
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useActivities } from '../hooks/useActivities';

const typeConfig = {
  travel: { icon: Plane, color: 'bg-gray-500', lightColor: 'bg-gray-100 text-gray-700' },
  activity: { icon: MapPin, color: 'bg-palm-500', lightColor: 'bg-palm-100 text-palm-700' },
  food: { icon: Utensils, color: 'bg-sunset-500', lightColor: 'bg-sunset-100 text-sunset-700' },
  adventure: { icon: Waves, color: 'bg-ocean-500', lightColor: 'bg-ocean-100 text-ocean-700' },
  nightlife: { icon: Music, color: 'bg-coral-500', lightColor: 'bg-coral-100 text-coral-700' },
};

export default function ActivityItem({ activity, dayDate, isLast }) {
  const { currentUser, setShowPicker } = useUser();
  const { activityStates, toggleActivity } = useActivities();

  const config = typeConfig[activity.type] || typeConfig.activity;
  const Icon = config.icon;

  const activityState = activityStates[activity.id];
  const isCompleted = activityState?.completed;
  const completedBy = activityState?.completedBy;

  // Check if this is the current activity based on time
  const now = new Date();
  const activityDate = new Date(dayDate);
  const [hours, minutes] = activity.time.split(':').map(Number);
  activityDate.setHours(hours, minutes, 0, 0);

  let endDate = new Date(dayDate);
  if (activity.endTime) {
    const [endHours, endMinutes] = activity.endTime.split(':').map(Number);
    // Handle overnight activities
    if (endHours < hours) {
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate.setHours(endHours, endMinutes, 0, 0);
  } else {
    endDate = new Date(activityDate.getTime() + 60 * 60 * 1000); // 1 hour default
  }

  const isCurrent = now >= activityDate && now <= endDate;
  const isPast = now > endDate;

  const handleToggle = () => {
    if (!currentUser) {
      setShowPicker(true);
      return;
    }
    toggleActivity(activity.id, currentUser);
  };

  return (
    <div
      className={`relative bg-white rounded-xl p-4 shadow-sm transition-all ${
        isCurrent ? 'ring-2 ring-ocean-400 animate-pulse-glow' : ''
      } ${isCompleted ? 'opacity-75' : ''}`}
    >
      {/* Current indicator */}
      {isCurrent && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-ocean-500 rounded-r-full" />
      )}

      <div className="flex gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 mt-1 transition-colors ${
            isCompleted ? 'text-palm-500' : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} className="fill-palm-100" />
          ) : (
            <Circle size={24} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.lightColor}`}>
                <Icon size={12} />
                {activity.type}
              </span>
              {activity.highlight && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sand-100 text-sand-700">
                  <Star size={12} className="fill-sand-400" />
                  Highlight
                </span>
              )}
              {activity.dressCode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-coral-100 text-coral-700">
                  <Shirt size={12} />
                  Dress Code
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm flex-shrink-0">
              <Clock size={14} />
              <span>{activity.time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-gray-800 mt-1 ${isCompleted ? 'line-through' : ''}`}>
            {activity.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-1">{activity.description}</p>

          {/* Vibe Note */}
          {activity.vibe && (
            <p className="text-ocean-600 text-sm mt-2 italic">
              "{activity.vibe}"
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            {activity.bikeTime && (
              <span className="flex items-center gap-1">
                <Bike size={12} />
                {activity.bikeTime}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {activity.location.name}
              </span>
            )}
          </div>

          {/* Dress code detail */}
          {activity.dressCode && (
            <div className="mt-2 text-xs text-coral-600 bg-coral-50 px-2 py-1 rounded-lg inline-block">
              Dress code: {activity.dressCode}
            </div>
          )}

          {/* Completed by */}
          {isCompleted && completedBy && (
            <div className="mt-2 text-xs text-palm-600">
              Completed by {completedBy}
            </div>
          )}
        </div>
      </div>

      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[26px] bottom-0 w-0.5 h-3 bg-gray-200 translate-y-full" />
      )}
    </div>
  );
}
