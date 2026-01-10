import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase/config';
import { itinerary as defaultItinerary } from '../data/itinerary';

const ItineraryContext = createContext(null);

const STORAGE_KEY = 'keywest-itinerary';
const VERSION_KEY = 'keywest-itinerary-version';
const CURRENT_VERSION = 3; // Bumped to clear old cache

export function ItineraryProvider({ children }) {
  const [itinerary, setItinerary] = useState(defaultItinerary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load itinerary data on mount
  useEffect(() => {
    // If Firebase is not configured, use localStorage fallback
    if (!database) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const version = localStorage.getItem(VERSION_KEY);

      if (saved && version === String(CURRENT_VERSION)) {
        try {
          setItinerary(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing saved itinerary:', e);
        }
      }
      setLoading(false);
      return;
    }

    const itineraryRef = ref(database, 'itinerary');

    const unsubscribe = onValue(
      itineraryRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data && data.version === CURRENT_VERSION) {
          setItinerary(data.days || defaultItinerary);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firebase error:', err);
        setError(err);
        setLoading(false);
        // Fall back to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        const version = localStorage.getItem(VERSION_KEY);
        if (saved && version === String(CURRENT_VERSION)) {
          try {
            setItinerary(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing saved itinerary:', e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Save to localStorage and Firebase
  const saveItinerary = useCallback(async (newItinerary) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItinerary));
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));

    // If Firebase is configured, sync to cloud
    if (database) {
      try {
        const itineraryRef = ref(database, 'itinerary');
        await set(itineraryRef, {
          version: CURRENT_VERSION,
          days: newItinerary,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error syncing itinerary to Firebase:', err);
      }
    }
  }, []);

  // Update a specific activity
  const updateActivity = useCallback((dayIndex, activityId, updates) => {
    setItinerary((prev) => {
      const newItinerary = prev.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map((activity) => {
            if (activity.id !== activityId) return activity;
            return { ...activity, ...updates };
          }),
        };
      });
      saveItinerary(newItinerary);
      return newItinerary;
    });
  }, [saveItinerary]);

  // Add a new activity to a day
  const addActivity = useCallback((dayIndex, newActivity) => {
    setItinerary((prev) => {
      const newItinerary = prev.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      });
      saveItinerary(newItinerary);
      return newItinerary;
    });
  }, [saveItinerary]);

  // Remove an activity from a day
  const removeActivity = useCallback((dayIndex, activityId) => {
    setItinerary((prev) => {
      const newItinerary = prev.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.filter((activity) => activity.id !== activityId),
        };
      });
      saveItinerary(newItinerary);
      return newItinerary;
    });
  }, [saveItinerary]);

  // Reorder activities within a day
  const reorderActivities = useCallback((dayIndex, sourceIndex, destIndex) => {
    setItinerary((prev) => {
      const newItinerary = prev.map((day, idx) => {
        if (idx !== dayIndex) return day;
        const newActivities = [...day.activities];
        const [removed] = newActivities.splice(sourceIndex, 1);
        newActivities.splice(destIndex, 0, removed);
        return { ...day, activities: newActivities };
      });
      saveItinerary(newItinerary);
      return newItinerary;
    });
  }, [saveItinerary]);

  // Reset to default itinerary
  const resetToDefault = useCallback(() => {
    setItinerary(defaultItinerary);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    if (database) {
      const itineraryRef = ref(database, 'itinerary');
      set(itineraryRef, null).catch(console.error);
    }
  }, []);

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        loading,
        error,
        updateActivity,
        addActivity,
        removeActivity,
        reorderActivities,
        resetToDefault,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
