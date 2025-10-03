/**
 * Notification Store - Zustand state management for toast notifications
 * Manages notification queue and display
 */

import { create } from 'zustand';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];

  // Actions
  addNotification: (
    type: Notification['type'],
    message: string
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  /**
   * Add a notification and display toast
   */
  addNotification: (type: Notification['type'], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };

    // Add to store
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Display toast
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, { icon: '⚠️' });
        break;
      case 'info':
      default:
        toast(message);
        break;
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  /**
   * Remove a notification by ID
   */
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    set({ notifications: [] });
  },
}));
