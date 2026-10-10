/**
 * Browser notification utility for timer completion
 */

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    return 'denied';
  }
}

export function showTimerNotification(title, options = {}) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }
  if (Notification.permission !== 'granted') {
    return null;
  }
  try {
    return new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  } catch (err) {
    console.warn('Could not show notification:', err);
    return null;
  }
}

export function sendTimerNotification(title, body) {
  return showTimerNotification(title, { body });
}

