import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase/config';

const STORAGE_KEY = 'keywest-packing-checklist';

export function usePackingChecklist() {
  // State structure: { [itemId]: { [userName]: { checked: bool, checkedAt: string } } }
  const [packingStates, setPackingStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is not configured, use localStorage fallback
    if (!database) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setPackingStates(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing saved packing checklist:', e);
        }
      }
      setLoading(false);
      return;
    }

    const packingRef = ref(database, 'packingChecklist');

    const unsubscribe = onValue(
      packingRef,
      (snapshot) => {
        const data = snapshot.val();
        setPackingStates(data || {});
        setLoading(false);
      },
      (err) => {
        console.error('Firebase error:', err);
        setError(err);
        setLoading(false);
        // Fall back to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setPackingStates(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing saved packing checklist:', e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const togglePackingItem = async (itemId, userName) => {
    const currentUserState = packingStates[itemId]?.[userName];
    const isChecked = currentUserState?.checked;

    const newUserState = isChecked
      ? { checked: false, checkedAt: null }
      : { checked: true, checkedAt: new Date().toISOString() };

    // Optimistic update
    setPackingStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [userName]: newUserState,
      },
    }));

    // If Firebase is configured, sync to cloud
    if (database) {
      try {
        const itemUserRef = ref(database, `packingChecklist/${itemId}/${userName}`);
        await set(itemUserRef, newUserState);
      } catch (err) {
        console.error('Error syncing to Firebase:', err);
        // Revert on error
        setPackingStates((prev) => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            [userName]: currentUserState || { checked: false },
          },
        }));
      }
    } else {
      // Save to localStorage as fallback
      const updated = {
        ...packingStates,
        [itemId]: {
          ...packingStates[itemId],
          [userName]: newUserState,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Check if a specific user has packed an item
  const isItemCheckedByUser = (itemId, userName) => {
    return packingStates[itemId]?.[userName]?.checked || false;
  };

  // Get all users who have packed an item
  const getUsersWhoPacked = (itemId) => {
    const itemState = packingStates[itemId];
    if (!itemState) return [];
    return Object.entries(itemState)
      .filter(([_, state]) => state.checked)
      .map(([userName]) => userName);
  };

  // Get packing progress for a user across all items
  const getUserProgress = (userName, totalItems) => {
    let packed = 0;
    Object.values(packingStates).forEach((itemState) => {
      if (itemState[userName]?.checked) {
        packed++;
      }
    });
    return { packed, total: totalItems };
  };

  return {
    packingStates,
    togglePackingItem,
    isItemCheckedByUser,
    getUsersWhoPacked,
    getUserProgress,
    loading,
    error,
  };
}
