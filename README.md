# Study Planner App - MERN Stack Project

A complete MERN (MongoDB, Express, React, Node.js) stack application for students to manage their study schedule, tasks, subjects, and notes.

## Features

- ✅ **User Authentication** - JWT-based registration and login
- ✅ **Subject Management** - Create, edit, and delete subjects with custom colors
- ✅ **Task Management** - Add tasks with duration, due date, priority, and preferred time
- ✅ **Automatic Timetable Generation** - AI-powered scheduler creates study slots from tasks
- ✅ **Timetable Management** - View daily schedule, mark slots as done
- ✅ **Notes System** - Create and manage notes for each subject
- ✅ **Dashboard** - Overview of today's tasks and schedule
- ✅ **Settings** - Customize study hours, preferred time, and timezone

## Project Structure

```
Study Planner App/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── subjectController.js
│   │   ├── taskController.js
│   │   ├── noteController.js
│   │   ├── timetableController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Task.js
│   │   ├── Note.js
│   │   └── TimetableSlot.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── timetableRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── scheduler.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── styles/
    │       └── styles.css
    ├── src/
    │   ├── api/
    │   │   └── api.js
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Subjects.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Schedule.jsx
    │   │   ├── Notes.jsx
    │   │   ├── NoteEditor.jsx
    │   │   └── Settings.jsx
    │   ├── styles/
    │   │   └── components.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file:**
   ```env
   MONGO_URI=mongodb://localhost:27017/study-planner
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```
   
   **For MongoDB Atlas:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/study-planner
   ```

5. **Start MongoDB:**
   - If using local MongoDB, make sure MongoDB service is running
   - For Windows: MongoDB should start automatically if installed as a service
   - For Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

6. **Run the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
   
   This creates a test user:
   - Email: `test@example.com`
   - Password: `password123`

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a single note
- `POST /api/notes` - Create a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Timetable
- `POST /api/timetable/generate` - Generate timetable for date range
- `GET /api/timetable/day?date=YYYY-MM-DD` - Get timetable for a day
- `PUT /api/timetable/:id` - Update a timetable slot
- `POST /api/timetable/:id/done` - Mark slot as done

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/settings` - Update user settings

**Note:** All routes except `/api/auth/*` require authentication (JWT token in Authorization header)

## Usage Guide

1. **Register/Login:**
   - Create a new account or use the seeded test account
   - Login to access the dashboard

2. **Create Subjects:**
   - Navigate to "Subjects" page
   - Click "+ Add Subject"
   - Enter title and choose a color

3. **Add Tasks:**
   - Go to "Tasks" page
   - Click "+ Add Task"
   - Fill in task details (title, subject, duration, due date, priority, preferred time)

4. **Generate Timetable:**
   - Go to "Schedule" page
   - Select a date
   - Click "Generate Timetable"
   - The system will automatically create study slots from your tasks

5. **Manage Notes:**
   - Go to "Notes" page
   - Click "+ New Note"
   - Write notes for any subject

6. **Configure Settings:**
   - Go to "Settings" page
   - Adjust study hours per day, preferred start time, and timezone

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Vite
- Axios for API calls
- Plain CSS (no frameworks)

## Development Notes

- The scheduler algorithm sorts tasks by due date, priority, and duration
- Tasks are fitted into 50-minute study blocks with 10-minute breaks
- All routes are protected with JWT middleware
- Frontend uses React Context for authentication state management
- CSS is organized into global styles and component-specific styles

## Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGO_URI in `.env` file
   - Verify MongoDB connection string format

2. **Port Already in Use:**
   - Change PORT in `.env` file
   - Or kill the process using the port

3. **CORS Errors:**
   - Ensure backend CORS is configured correctly
   - Check that frontend proxy settings in `vite.config.js` are correct

4. **JWT Token Errors:**
   - Clear browser localStorage
   - Login again to get a new token

## License

This project is open source and available for educational purposes.

---

**Happy Studying! 📚**










