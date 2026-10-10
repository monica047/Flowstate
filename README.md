# Flowstate — Pomodoro Productivity Web Application

A distraction-free Pomodoro focus timer and productivity tracking application with forest-inspired aesthetics. Built with React, modular standard CSS stylesheets, Web Audio API sound synthesis, and persistent client-side storage.

Public Application URL: https://flowstate-0718.ai.studio/

---

## Tech Stack

- Frontend Framework: React 19 (JavaScript ES6+)
- Build Tool and Dev Server: Vite
- Styling: Standard modular CSS with CSS variables (no Tailwind CSS, no CSS-in-JS)
- Icons: Lucide React
- Audio Synthesis: Native Web Audio API oscillator synthesis (no external audio asset dependencies)
- Persistence: LocalStorage with versioned schemas and data validation
- Notifications: Native Web Notifications API

---

## Features

### 1. Drift-Free Precision Pomodoro Timer
- Three operational modes: Focus (25m default), Short Break (5m default), and Long Break (15m default).
- Dynamic mode cycle: Sequential progression through Focus, Short Break, Long Break, and back to Focus.
- Drift-proof timekeeping: Uses timestamp delta calculations (Date.now()) against target completion times to prevent clock drift during tab throttling, backgrounding, or system sleep.
- Timer controls: Start, Pause, Resume, Reset, and Skip.
- Mode tabs: Direct switching between Focus, Short Break, and Long Break at any point.

### 2. Forest Aesthetic Ambience
- Natural deep woodland visuals and atmospheric vignette overlays.
- Color palette based on deep pines, moss greens, warm timber ambers, and dark spruce surfaces.
- Geometric, crisp container architecture avoiding artificial pill shapes.
- Four selectable atmospheric themes: Pine Canopy, Misty Timber, Dusk Woodlands, and Deep Evergreen.

### 3. Task Management
- Create, update, prioritize, and delete tasks.
- Associate active tasks directly with focus sessions.
- Track completed Pomodoro sessions against estimated target sessions per task.
- Filter tasks by status: All, Active, Completed, and High Priority.
- Quick slide-out task drawer accessible from the focus dashboard.

### 4. Experience Points (XP) and Level Progression
- XP earned proportionally to completed deep focus duration (25 XP per 25 minutes of focus).
- Progressive leveling thresholds requiring increasing XP for higher tiers.
- Completion reward modal displaying session duration, XP earned, total XP, and progress toward the next tier.
- Celebration state triggered upon leveling up.
- Zero XP awarded for break sessions, abandoned timers, or skipped periods.

### 5. Streak Calendar
- Monthly calendar matrix displaying historical activity.
- Daily focus session tracking with session count and total focus minutes per day.
- Consecutive day streak tracking calculating current streak and longest recorded streak based on local calendar dates.
- Interactive month navigation with quick return to the current date.

### 6. Productivity Statistics and Analytics
- Time-frame filters: Today, 7 Days, 30 Days, and All Time.
- High-contrast metric cards: Current Streak, Deep Focus Time, Total XP, Tasks Completed, Completed Sessions, and Mindful Recovery Time.
- Seven-day interactive activity bar chart visualizing daily focus distribution.

### 7. Milestones and Achievements
- Six unlockable achievements: First Step, Focus Momentum, Deep Diver, Unstoppable Habit, Centurion of Focus, and Flowstate Master.
- Live requirement checks, progress bars, and timestamped unlock records.

### 8. Audio and Notifications
- Synthesized resonant chime using Web Audio API harmonic sine waves upon session completion.
- Separate fanfare sound effect on level-up.
- Master volume controls and mute toggles.
- Desktop browser notifications with explicit permission handling.

### 9. Quick Scratchpad
- Non-intrusive drawer to jot quick notes, thoughts, or brain dumps without leaving the focus state.
- Real-time word and character counter.
- Persistent automatic saving to LocalStorage.

### 10. Settings and Data Integrity
- Fully customizable durations for Focus, Short Break, and Long Break.
- Configurable long break intervals.
- Automation toggles for auto-starting breaks and auto-starting focus sessions.
- Theme selector and reduced-motion support.
- Hard reset option with confirmation dialogue to clear all stored application data.

---

## Project Structure
