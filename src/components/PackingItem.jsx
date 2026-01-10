import { CheckCircle2, Circle } from 'lucide-react';
import { friends } from '../data/itinerary';
import { usePackingChecklist } from '../hooks/usePackingChecklist';
import { useUser } from '../context/UserContext';

// Color mapping for each friend
const friendColors = {
  Rohit: 'text-ocean-600 bg-ocean-100',
  Alex: 'text-palm-600 bg-palm-100',
  Prosin: 'text-sunset-600 bg-sunset-100',
  Lucas: 'text-coral-600 bg-coral-100',
  Matthew: 'text-purple-600 bg-purple-100',
};

const friendCheckColors = {
  Rohit: 'text-ocean-500',
  Alex: 'text-palm-500',
  Prosin: 'text-sunset-500',
  Lucas: 'text-coral-500',
  Matthew: 'text-purple-500',
};

export default function PackingItem({ item }) {
  const { togglePackingItem, isItemCheckedByUser } = usePackingChecklist();
  const { currentUser, setShowPicker } = useUser();

  const handleToggle = (userName) => {
    if (!currentUser) {
      setShowPicker(true);
      return;
    }
    // Only allow toggling your own checkbox
    if (userName === currentUser) {
      togglePackingItem(item.id, userName);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Item Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-800 text-sm font-medium truncate">
          {item.name}
        </span>
        {item.quantity > 1 && (
          <span className="flex-shrink-0 bg-sand-100 text-sand-700 text-xs px-2 py-0.5 rounded-full">
            x{item.quantity}
          </span>
        )}
      </div>

      {/* Per-User Checkboxes */}
      <div className="flex items-center gap-1">
        {friends.map((friend) => {
          const isChecked = isItemCheckedByUser(item.id, friend);
          const isCurrentUser = friend === currentUser;
          const initial = friend.charAt(0);

          return (
            <button
              key={friend}
              onClick={() => handleToggle(friend)}
              disabled={!isCurrentUser}
              title={isCurrentUser ? `Mark as packed` : `${friend}'s checkbox`}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isCurrentUser
                  ? 'hover:scale-110 cursor-pointer'
                  : 'cursor-default opacity-70'
              } ${friendColors[friend]}`}
            >
              {isChecked ? (
                <CheckCircle2
                  size={20}
                  className={`${friendCheckColors[friend]} fill-current`}
                />
              ) : (
                <span className="text-xs font-bold">{initial}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
