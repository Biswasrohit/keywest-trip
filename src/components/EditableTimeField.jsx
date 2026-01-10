import { useState, useRef, useEffect } from 'react';
import { Clock, Pencil, Check, X } from 'lucide-react';
import { formatTimeToAMPM } from '../utils/timeUtils';

export default function EditableTimeField({ time, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState(time);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditTime(time);
  }, [time]);

  const handleSave = () => {
    if (editTime !== time) {
      onSave(editTime);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTime(time);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Clock size={14} className="text-gray-500" />
        <input
          ref={inputRef}
          type="time"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="px-1 py-0.5 text-sm border border-ocean-300 rounded focus:outline-none focus:ring-2 focus:ring-ocean-400"
        />
        <button
          onClick={handleSave}
          className="p-0.5 text-palm-600 hover:bg-palm-100 rounded"
          title="Save"
        >
          <Check size={14} />
        </button>
        <button
          onClick={handleCancel}
          className="p-0.5 text-coral-600 hover:bg-coral-100 rounded"
          title="Cancel"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center gap-1 text-gray-500 text-sm cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <Clock size={14} />
      <span>{formatTimeToAMPM(time)}</span>
      <Pencil
        size={12}
        className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity"
      />
    </div>
  );
}
