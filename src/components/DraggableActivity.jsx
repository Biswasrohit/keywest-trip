import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import ActivityItem from './ActivityItem';

export default function DraggableActivity({ activity, dayIndex, dayDate, isLast }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/drag">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-1 cursor-grab active:cursor-grabbing opacity-0 group-hover/drag:opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <div className="p-1 rounded hover:bg-gray-100">
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </div>
      <ActivityItem
        activity={activity}
        dayIndex={dayIndex}
        dayDate={dayDate}
        isLast={isLast}
      />
    </div>
  );
}
