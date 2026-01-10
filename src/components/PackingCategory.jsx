import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePackingChecklist } from '../hooks/usePackingChecklist';
import { useUser } from '../context/UserContext';
import PackingItem from './PackingItem';

export default function PackingCategory({ category, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const { isItemCheckedByUser } = usePackingChecklist();
  const { currentUser } = useUser();

  // Count how many items the current user has packed in this category
  const packedCount = currentUser
    ? category.items.filter(item => isItemCheckedByUser(item.id, currentUser)).length
    : 0;
  const totalCount = category.items.length;
  const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        {/* Emoji & Name */}
        <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center text-xl">
          {category.emoji}
        </div>

        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
          <div className="text-xs text-gray-500">{totalCount} items</div>
        </div>

        {/* Progress */}
        {currentUser && (
          <div className="text-right mr-2">
            <div className="text-xs font-medium text-gray-600">
              {packedCount}/{totalCount}
            </div>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-palm-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Expand Icon */}
        <div className="text-gray-400">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Items List */}
      {expanded && (
        <div className="p-3 pt-0 space-y-2">
          {category.items.map((item) => (
            <PackingItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
