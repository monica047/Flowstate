/**
 * Local date streak calculation for Flowstate
 */

export function getLocalDateString(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreaks(sessions = []) {
  // Only completed focus sessions count toward streak
  const focusDatesSet = new Set(
    sessions
      .filter((s) => s.mode === 'focus' && s.durationSeconds >= 60)
      .map((s) => s.dateKey || getLocalDateString(new Date(s.timestamp)))
  );

  if (focusDatesSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 };
  }

  // Sorted list of distinct YYYY-MM-DD
  const sortedDates = Array.from(focusDatesSet).sort();
  const activeDaysCount = sortedDates.length;

  // Calculate longest streak across all history
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffMs = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Calculate current streak relative to today
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let currentStreak = 0;
  let checkDate = new Date();

  if (focusDatesSet.has(todayStr)) {
    // Has focused today
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
    while (focusDatesSet.has(getLocalDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (focusDatesSet.has(yesterdayStr)) {
    // Yesterday had a session, streak is preserved today awaiting a session
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
    while (focusDatesSet.has(getLocalDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount,
  };
}

export const calculateStreak = calculateStreaks;

