import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

export default function EditableField({
  value,
  onSave,
  type = 'text',
  className = '',
  placeholder = 'Click to edit...',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-start gap-2">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 text-sm border border-ocean-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
            rows={2}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 text-sm border border-ocean-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-400"
            placeholder={placeholder}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 text-palm-600 hover:bg-palm-100 rounded"
          title="Save"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-coral-600 hover:bg-coral-100 rounded"
          title="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`group cursor-pointer flex items-start gap-1 ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={value ? '' : 'text-gray-400 italic'}>
        {value || placeholder}
      </span>
      <Pencil
        size={14}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity mt-0.5"
      />
    </div>
  );
}
