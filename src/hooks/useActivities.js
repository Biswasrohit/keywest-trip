import { useState, useEffect } from 'react';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config';

export function useActivities() {
  const [activityStates, setActivityStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is not configured, use localStorage fallback
    if (!database) {
      const saved = localStorage.getItem('keywest-activities');
      if (saved) {
        try {
          setActivityStates(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing saved activities:', e);
        }
      }
      setLoading(false);
      return;
    }

    const activitiesRef = ref(database, 'activities');

    const unsubscribe = onValue(
      activitiesRef,
      (snapshot) => {
        const data = snapshot.val();
        setActivityStates(data || {});
        setLoading(false);
      },
      (err) => {
        console.error('Firebase error:', err);
        setError(err);
        setLoading(false);
        // Fall back to localStorage
        const saved = localStorage.getItem('keywest-activities');
        if (saved) {
          try {
            setActivityStates(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing saved activities:', e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleActivity = async (activityId, userName) => {
    const currentState = activityStates[activityId];
    const isCompleted = currentState?.completed;

    const newState = isCompleted
      ? { completed: false, completedBy: null, completedAt: null }
      : { completed: true, completedBy: userName, completedAt: new Date().toISOString() };

    // Optimistic update
    setActivityStates((prev) => ({
      ...prev,
      [activityId]: newState,
    }));

    // If Firebase is configured, sync to cloud
    if (database) {
      try {
        const activityRef = ref(database, `activities/${activityId}`);
        await set(activityRef, newState);
      } catch (err) {
        console.error('Error syncing to Firebase:', err);
        // Revert on error
        setActivityStates((prev) => ({
          ...prev,
          [activityId]: currentState || { completed: false },
        }));
      }
    } else {
      // Save to localStorage as fallback
      const updated = { ...activityStates, [activityId]: newState };
      localStorage.setItem('keywest-activities', JSON.stringify(updated));
    }
  };

  return { activityStates, toggleActivity, loading, error };
}
