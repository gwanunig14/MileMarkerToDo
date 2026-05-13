# MileMarkerToDo

A cross-platform to-do and reminder management app built with Expo and React Native. Track your tasks with priorities and due dates, or create quick reminders for important items.

Two lists are creatable: To-Do and Reminder. To-Do can be given a priority and a due date, reminders are simply there as, well, a reminder.

To-Do is arranged by due time and then priority. Reminders are arranged by date added.

Pushnotifications are optional and customizable in 5 minute increments.

Tasks are completable, and past due items are checked on.

Dark aesthetic was chosen from example designs. I opted for the color fade because that looks cool, then simply asked AI for colors that complimented the background view.

## Features

- **Dual List System**
  - **To-Do List**: Full-featured tasks with due dates, times, and priority levels (Low, Medium, High)
  - **Reminder List**: Quick reminders with just a title (no date/priority required)
  - Both lists are collapsible and auto-collapse when empty

- **User Authentication**: Secure login system with encrypted credential storage

- **Task Management**
  - Add new to-dos with customizable due dates and times
  - Set task priority levels
  - Mark tasks as complete (remove them from the list)
  - Reminders and to-dos are managed separately but use the same completion system

- **Dark Mode UI**: Beautiful dark-themed interface optimized for mobile devices

- **Cross-Platform**: Runs on iOS, Android, and web

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd MileMarkerToDo
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npx expo start
```

4. Run the app on your device or emulator:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
app/
├── _layout.tsx           # Main layout and routing configuration
├── index.tsx             # Main to-do list screen
├── login.tsx             # Authentication screen
├── task-modal.tsx        # Modal for adding to-dos and reminders
├── remove-modal.tsx      # Confirmation modal for deleting items
├── overdue-modal.tsx     # Modal for handling overdue tasks
└── todo-scrollview.tsx   # Scrollable list component

components/
├── themed-text.tsx       # Themed text component
├── themed-view.tsx       # Themed view component
└── ui/
    └── priority-button.tsx # Priority selection button

constants/
├── theme.ts              # Theme configuration
└── themed-colors.tsx     # Color definitions

hooks/
├── use-color-scheme.ts   # Color scheme detection
├── use-color-scheme.web.ts
└── use-theme-color.ts    # Theme color hook

lib/
├── auth.ts               # Authentication logic
└── todo-store.tsx        # State management for todos and reminders

assets/
└── images/               # App images and icons
```

## Development

### Authentication

User credentials are stored securely using:

- **Native platforms (iOS/Android)**: Expo SecureStore
- **Web**: Browser localStorage

### State Management

The app uses React Context API for global state management through `useTodoStore()`, which manages:

- To-do items (with due dates, times, and priorities)
- Reminders (simple title-only items)
- User data persistence

### Data Storage

- To-dos and reminders are stored per user
- All data is persisted locally on the device
- Overdue tasks trigger a prompt on app startup

## Key Workflows

### Adding a To-Do

1. Tap "Add" button
2. Toggle stays on "New To-Do" (default)
3. Enter task name
4. Set due date and time
5. Select priority level
6. Tap "Save"

### Adding a Reminder

1. Tap "Add" button
2. Toggle to "Reminder"
3. Enter reminder name
4. Tap "Save"

### Completing a Task

1. Tap on any to-do or reminder item
2. Confirm removal in the modal
3. Item is deleted from the list

## Technologies

- **Expo**: React Native framework for cross-platform development
- **React Native**: Mobile UI framework
- **TypeScript**: Type-safe JavaScript
- **expo-router**: File-based routing
- **expo-secure-store**: Secure credential storage
- **Linear Gradient**: Gradient background effects
