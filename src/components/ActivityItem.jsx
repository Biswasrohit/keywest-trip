import { useState } from 'react';
import {
  Plane, MapPin, Utensils, Waves, Music, Bike,
  CheckCircle2, Circle, Star, Shirt, Trash2
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useActivities } from '../hooks/useActivities';
import { useItinerary } from '../context/ItineraryContext';
import EditableField from './EditableField';
import EditableTimeField from './EditableTimeField';

const typeConfig = {
  travel: { icon: Plane, color: 'bg-gray-500', lightColor: 'bg-gray-100 text-gray-700' },
  activity: { icon: MapPin, color: 'bg-palm-500', lightColor: 'bg-palm-100 text-palm-700' },
  food: { icon: Utensils, color: 'bg-sunset-500', lightColor: 'bg-sunset-100 text-sunset-700' },
  adventure: { icon: Waves, color: 'bg-ocean-500', lightColor: 'bg-ocean-100 text-ocean-700' },
  nightlife: { icon: Music, color: 'bg-coral-500', lightColor: 'bg-coral-100 text-coral-700' },
};

export default function ActivityItem({ activity, dayIndex, dayDate, isLast }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { currentUser, setShowPicker } = useUser();
  const { activityStates, toggleActivity } = useActivities();
  const { updateActivity, removeActivity } = useItinerary();

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

  const handleToggle = () => {
    if (!currentUser) {
      setShowPicker(true);
      return;
    }
    toggleActivity(activity.id, currentUser);
  };

  const handleTitleSave = (newTitle) => {
    updateActivity(dayIndex, activity.id, { title: newTitle });
  };

  const handleDescriptionSave = (newDescription) => {
    updateActivity(dayIndex, activity.id, { description: newDescription });
  };

  const handleTimeSave = (newTime) => {
    updateActivity(dayIndex, activity.id, { time: newTime });
  };

  const handleDelete = () => {
    removeActivity(dayIndex, activity.id);
    setShowDeleteConfirm(false);
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
            <div className="flex items-center gap-2">
              <EditableTimeField
                time={activity.time}
                onSave={handleTimeSave}
              />
              {/* Delete Button */}
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDelete}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete event"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div className={`mt-1 ${isCompleted ? 'line-through' : ''}`}>
            <EditableField
              value={activity.title}
              onSave={handleTitleSave}
              type="text"
              className="font-semibold text-gray-800"
              placeholder="Add a title..."
            />
          </div>

          {/* Description */}
          <div className="mt-1">
            <EditableField
              value={activity.description}
              onSave={handleDescriptionSave}
              type="textarea"
              className="text-gray-600 text-sm"
              placeholder="Add a description..."
            />
          </div>

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
