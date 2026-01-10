import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Plus, X } from 'lucide-react';
import { format, parseISO, isToday, isPast } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useItinerary } from '../context/ItineraryContext';
import DraggableActivity from './DraggableActivity';

const activityTypes = ['activity', 'food', 'travel', 'adventure', 'nightlife'];

export default function DayCard({ day, dayIndex, activities, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '12:00',
    type: 'activity',
  });

  const { itinerary, reorderActivities, addActivity } = useItinerary();
  const date = parseISO(day.date);
  const isCurrent = isToday(date);
  const isComplete = isPast(date) && !isToday(date);

  // Use activities from context to ensure we have the latest order
  const currentActivities = itinerary[dayIndex]?.activities || [];

  const completedCount = activities?.filter(a => a.completed)?.length || 0;
  const totalCount = currentActivities.length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentActivities.findIndex(a => a.id === active.id);
    const newIndex = currentActivities.findIndex(a => a.id === over.id);

    // Guard against invalid indices
    if (oldIndex === -1 || newIndex === -1) return;

    reorderActivities(dayIndex, oldIndex, newIndex);
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const activity = {
      id: `day${day.day}-${Date.now()}`,
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      time: newEvent.time,
      type: newEvent.type,
      location: { name: 'Key West', lat: 24.5551, lng: -81.7800 },
    };

    addActivity(dayIndex, activity);
    setNewEvent({ title: '', description: '', time: '12:00', type: 'activity' });
    setShowAddForm(false);
  };

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
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Expand Icon */}
        <div className={isCurrent ? 'text-white' : 'text-gray-500'}>
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {/* Activities with Drag and Drop */}
      {expanded && (
        <div className="p-4 pl-8 space-y-3 bg-gray-50">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentActivities.map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentActivities.map((activity, index) => (
                <DraggableActivity
                  key={activity.id}
                  activity={activity}
                  dayIndex={dayIndex}
                  dayDate={day.date}
                  isLast={index === currentActivities.length - 1 && !showAddForm}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Event Form */}
          {showAddForm ? (
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-ocean-300">
              <form onSubmit={handleAddEvent} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700">Add New Event</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event name"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-400"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Add details..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newEvent.title.trim()}
                    className="flex-1 px-4 py-2 bg-ocean-500 text-white text-sm font-medium rounded-lg hover:bg-ocean-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50 rounded-xl border-2 border-dashed border-ocean-200 transition-colors"
            >
              <Plus size={20} />
              <span className="font-medium">Add Event</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
