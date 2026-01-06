import { createContext, useContext, useState, useEffect } from 'react';
import { friends } from '../data/itinerary';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('keywest-user');
    return saved || null;
  });
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('keywest-user', currentUser);
    }
  }, [currentUser]);

  const selectUser = (name) => {
    setCurrentUser(name);
    setShowPicker(false);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      selectUser,
      showPicker,
      setShowPicker,
      friends
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
