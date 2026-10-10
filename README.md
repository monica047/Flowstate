# 🌲 Flowstate — Premium Pomodoro Productivity Web App

A distraction-free, aesthetic Pomodoro focus timer and productivity tracker inspired by serene deep-woods atmospheres. Built with pure React, modern standard CSS variables, Web Audio synthesis, and persistent client-side storage.

🔗 **Live Deployment:** [https://ais-pre-6ybs2tcanncoeaslzuajhw-929894199263.asia-southeast1.run.app](https://ais-pre-6ybs2tcanncoeaslzuajhw-929894199263.asia-southeast1.run.app)

---

## ✨ Core Features

### 1. ⏱️ Drift-Free Precision Pomodoro Timer
- **Modes**: Focus (default 25m), Short Break (5m), and Long Break (15m).
- **Controls**: Smooth Start, Pause, Resume, Reset, and Skip cycle buttons.
- **Drift Prevention**: Uses delta timestamps (`Date.now()`) to prevent timer drift across background tab inactivity and system sleep.
- **Cycle Transitions**: Smoothly cycles between Focus, Short Break, and Long Break intervals.

### 2. 🌲 Forest Atmosphere & Aesthetics
- Crisp, human-crafted geometry (no AI-style hyper-rounded pills).
- Natural evergreen and pine backdrops with subtle atmospheric vignettes.
- 4 Forest Themes: *Pine Canopy*, *Misty Timber*, *Dusk Woodlands*, and *Deep Evergreen*.

### 3. 📋 Functional Task Manager
- Create, edit, prioritize (High, Medium, Low), and complete tasks.
- Track estimated vs. completed Pomodoro sessions per task.
- Directly connect any task to the active focus session timer.

### 4. ⚡ XP & Level Progression System
- Earn XP proportionally to completed deep focus duration (25 XP for 25 minutes).
- Non-linear leveling curve with leveling celebrations.
- Visual XP progress bar and level badges.

### 5. 📅 Local Streak Calendar
- Monthly visual calendar highlighting authentic days of focus activity.
- Consecutive day streak tracking (Current Streak and Longest Streak).
- Calculated entirely from local calendar dates.

### 6. 📊 Authentic Productivity Analytics
- Filterable stats (Today, 7 Days, 30 Days, All Time).
- Focus time totals, completed sessions count, recovery intervals taken, and tasks completed.
- 7-Day interactive activity bar chart.

### 7. 🏆 Milestones & Achievements
- Unlockable badges for milestones (First Step, Focus Momentum, Deep Diver, Unstoppable Habit, Centurion of Focus, Flowstate Master).
- Live progress tracking and timestamped unlock records.

### 8. 🔔 Ambient Audio & System Alerts
- Web Audio API harmonic chime synthesizer (zero external audio file dependencies).
- Browser notification support for background session completion alerts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (ES6+ standard JavaScript)
- **Styling**: Standard CSS with CSS variables (`src/styles/`), responsive flex/grid layouts
- **Icons**: Lucide React
- **Audio**: Web Audio API oscillator synthesis
- **Storage**: Browser LocalStorage with automatic schema versioning
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/flowstate.git
cd flowstate

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` or the port shown in your terminal.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
├── index.html                 # HTML entry with typography links
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root app state & navigation
│   ├── index.css              # Global styles entry
│   ├── assets/                # Forest aesthetic photography
│   ├── components/
│   │   ├── FocusTimer.jsx     # Hero Pomodoro clock & controls
│   │   ├── Header.jsx         # App header with streak & XP
│   │   ├── BottomDock.jsx     # Dock navigation controls
│   │   ├── NavigationSidebar.jsx # Main menu drawer
│   │   ├── QuickTasksDrawer.jsx  # Slide-out task manager
│   │   ├── QuickNotesDrawer.jsx  # Scratchpad notepad
│   │   ├── QuickThemesDrawer.jsx # Ambience theme switcher
│   │   ├── RewardModal.jsx    # Session & Level-up celebration modal
│   │   └── ConfirmModal.jsx   # Data reset confirmation dialog
│   ├── hooks/
│   │   └── useTimer.js        # Timestamp-based drift-free timer engine
│   ├── pages/
│   │   ├── DashboardPage.jsx  # Primary Focus Dashboard
│   │   ├── TasksPage.jsx      # Full Task Manager
│   │   ├── StatisticsPage.jsx # Productivity Analytics & Charts
│   │   ├── CalendarPage.jsx   # Streak Calendar
│   │   ├── AchievementsPage.jsx # Unlocks & Milestones
│   │   └── SettingsPage.jsx   # Timer, Audio, & Theme Preferences
│   ├── styles/                # Modular standard stylesheets
│   └── utils/
│       ├── audio.js           # Web Audio API chime sound generator
│       ├── notifications.js   # Browser notifications helper
│       ├── storage.js         # LocalStorage persistence & XP engine
│       └── streak.js          # Streak calculation algorithms
```

---

## 📄 License
MIT License. Free to use and customize.
