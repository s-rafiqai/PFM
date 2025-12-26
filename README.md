# Priority Focus Manager

A minimalist web application designed for managers to track their direct reports' priorities during one-on-one catch-up meetings.

## Core Philosophy

**Intentional Simplicity** - This app is designed to feel like a digital notepad, not an enterprise HR platform. The interface adapts to the number of team members, with panels getting smaller as more members are added. This is a feature, not a bug - it provides visual feedback about team size and management capacity.

## Features

- **Adaptive Split-Screen View**: Grid layout that automatically adjusts based on team size
- **Inline Editing**: Click to edit team member names and priorities
- **Auto-Save**: All changes are automatically saved with visual feedback
- **Priority Management**: Add, edit, complete, and delete priorities
- **Clean Interface**: Minimal UI that maximizes content space
- **Intentional Constraints**: Visual feedback when managing many team members

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- RESTful API

### Frontend
- React 18
- Tailwind CSS
- Vite build tool
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PFM
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb priority_focus_manager
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env with your settings
   # Update DATABASE_URL and JWT_SECRET
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (from the `backend` directory)
   ```bash
   npm run dev
   ```
   The API will run on http://localhost:3001

2. **Start the frontend development server** (from the `frontend` directory)
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## Usage

### First Time Setup

1. **Create an account**: Register with your email, password, and name
2. **Add your first team member**: Click "Add First Team Member"
3. **Add priorities**: Click in the priority input field and press Enter

### Daily Use

- **View all team members at once**: The grid automatically adjusts to show everyone
- **Edit names**: Click on any team member's name to edit
- **Manage priorities**:
  - Click on priority text to edit
  - Click checkbox to mark as complete
  - Hover to reveal delete button
- **Add team members**: Click "+ Add Team Member" button

### Visual Feedback

As you add more team members:
- **1 member**: Full screen view
- **2 members**: 50/50 split
- **3 members**: Three columns
- **4 members**: 2×2 grid
- **5-6 members**: 2×3 grid
- **7+ members**: Continues expanding with smaller panels

When you have 8+ team members, you'll see a message reminding you that the constrained view is intentional - it's feedback about team size and management capacity.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Sign out

### Team Members
- `GET /api/team-members` - List all team members
- `POST /api/team-members` - Create new team member
- `PATCH /api/team-members/:id` - Update team member
- `DELETE /api/team-members/:id` - Archive team member
- `PATCH /api/team-members/reorder` - Reorder team members

### Priorities
- `GET /api/team-members/:id/priorities` - List priorities
- `POST /api/team-members/:id/priorities` - Create priority
- `PATCH /api/priorities/:id` - Update priority
- `DELETE /api/priorities/:id` - Delete priority
- `PATCH /api/priorities/reorder` - Reorder priorities

## Project Structure

```
PFM/
├── backend/
│   ├── database/
│   │   └── migrations/      # SQL migrations
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   └── index.js         # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## Design Decisions

### Why No Drag-and-Drop?
The MVP focuses on core functionality. Priorities can be reordered via the API, and drag-and-drop can be added in future iterations.

### Why Auto-Archive Instead of Delete?
Team members are archived (soft deleted) to preserve historical data and allow recovery if needed.

### Why the Shrinking Panels?
This is the app's signature feature. As panels get smaller with more team members, it provides visual feedback about management capacity and team size. It's intentional, not a limitation.

### Why No Categories or Tags?
Keeping it simple. The app is designed to track 3-5 key priorities per person, not hundreds of categorized tasks.

## Future Enhancements (Post-MVP)

- [ ] Drag-and-drop reordering
- [ ] Priority history view
- [ ] Catch-up session markers
- [ ] Focus mode (single team member full-screen)
- [ ] PWA / offline support
- [ ] Mobile native apps
- [ ] Data export
- [ ] Keyboard shortcuts
- [ ] Dark mode

## What This App Intentionally Does NOT Include

- ❌ Team member login/access (manager-only tool)
- ❌ Calendar integration
- ❌ Email notifications
- ❌ Goal/OKR tracking
- ❌ Performance reviews
- ❌ Analytics dashboards
- ❌ Comments or collaboration
- ❌ Multiple views (Kanban, timeline, etc.)
- ❌ Rich text formatting

## Contributing

This project follows the principle of intentional simplicity. When considering features:
1. Ask "What can we remove?" rather than "What can we add?"
2. Maintain the notepad aesthetic
3. Preserve the visual feedback mechanism
4. Keep the learning curve under 2 minutes

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

---

**Built with the mindset: "What can I remove?" rather than "What can I add?"**

The goal is a tool so simple that a busy manager will actually use it, not another app that gets abandoned after the first week.
