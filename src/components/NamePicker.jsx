import { useUser } from '../context/UserContext';
import { X, User } from 'lucide-react';

export default function NamePicker() {
  const { friends, selectUser, setShowPicker, currentUser } = useUser();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 p-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">Who's checking in?</h2>
          <button
            onClick={() => setShowPicker(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Friend List */}
        <div className="p-4 space-y-2">
          {friends.map((friend) => (
            <button
              key={friend}
              onClick={() => selectUser(friend)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                currentUser === friend
                  ? 'bg-ocean-100 border-2 border-ocean-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentUser === friend ? 'bg-ocean-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <User size={20} />
              </div>
              <span className={`font-medium ${
                currentUser === friend ? 'text-ocean-700' : 'text-gray-700'
              }`}>
                {friend}
              </span>
              {currentUser === friend && (
                <span className="ml-auto text-ocean-500 text-sm">Selected</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 text-center">
          <p className="text-gray-500 text-sm">
            Select your name to track activities
          </p>
        </div>
      </div>
    </div>
  );
}
