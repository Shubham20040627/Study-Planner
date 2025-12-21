import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

const Dashboard = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const todayStr = todayDate.toISOString().split('T')[0];
      const tomorrow = new Date(todayDate);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch today's tasks
      const tasksRes = await api.get('/tasks');
      const allTasks = tasksRes.data;

      const todayTasksList = allTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= todayDate && dueDate < tomorrow && !task.completed;
      });

      setTodayTasks(todayTasksList.slice(0, 5)); // Show top 5

      // Calculate stats
      setStats({
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter((t) => t.completed).length,
        pendingTasks: allTasks.filter((t) => !t.completed).length,
      });

      // Fetch today's schedule
      const scheduleRes = await api.get(`/timetable/day?date=${todayStr}`);
      setTodaySchedule(scheduleRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero / Overview */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-text">
            <p className="dashboard-badge">Today&apos;s Study Overview</p>
            <h1 className="dashboard-title">Plan. Focus. Finish Strong.</h1>
            <p className="dashboard-subtitle">
              See your most important tasks and today&apos;s schedule at a
              glance. Stay consistent with smart, auto-generated study blocks.
            </p>
            <div className="dashboard-cta">
              <Link to="/tasks" className="btn btn-primary">
                + Add New Task
              </Link>
              <Link to="/schedule" className="btn btn-outline">
                View Full Timetable
              </Link>
            </div>
          </div>

          <div className="dashboard-hero-card">
            <div className="progress-ring">
              <div className="progress-ring-inner">
                <span className="progress-ring-value">
                  {stats.totalTasks
                    ? Math.round(
                        (stats.completedTasks / stats.totalTasks) * 100
                      )
                    : 0}
                  %
                </span>
                <span className="progress-ring-label">Completion</span>
              </div>
            </div>
            <div className="dashboard-hero-meta">
              <div className="meta-row">
                <span className="meta-label">Total Tasks</span>
                <span className="meta-value">{stats.totalTasks}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Done Today</span>
                <span className="meta-value meta-value-success">
                  {stats.completedTasks}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Pending</span>
                <span className="meta-value meta-value-warning">
                  {stats.pendingTasks}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Today&apos;s Slots</span>
                <span className="meta-value">{todaySchedule.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="stat-pill">
            <span className="stat-pill-label">Total Tasks</span>
            <span className="stat-pill-value">{stats.totalTasks}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-label">Completed</span>
            <span className="stat-pill-value stat-pill-success">
              {stats.completedTasks}
            </span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-label">Pending</span>
            <span className="stat-pill-value stat-pill-warning">
              {stats.pendingTasks}
            </span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-label">Today&apos;s Slots</span>
            <span className="stat-pill-value">{todaySchedule.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading your study plan...</div>
        ) : (
          <div className="dashboard-grid">
            {/* Today&apos;s Tasks */}
            <div className="card card-elevated">
              <div className="card-header">
                <h2>Today&apos;s Tasks</h2>
                <Link to="/tasks" className="btn btn-sm btn-outline">
                  View All
                </Link>
              </div>
              <div className="card-body">
                {todayTasks.length === 0 ? (
                  <p className="text-muted">
                    No tasks for today. Add a new task to start planning.
                  </p>
                ) : (
                  <ul className="task-list">
                    {todayTasks.map((task) => (
                      <li key={task._id} className="task-item task-item-card">
                        <div className="task-item-content">
                          <div className="task-main">
                            <span className="task-title">{task.title}</span>
                            <span className="task-meta-line">
                              {new Date(
                                task.dueDate
                              ).toLocaleDateString()}{' '}
                              • {task.durationMinutes} min
                            </span>
                          </div>
                          {task.subject && (
                            <span
                              className="task-subject-badge"
                              style={{ backgroundColor: task.subject.color }}
                            >
                              {task.subject.title}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Today&apos;s Schedule */}
            <div className="card card-elevated">
              <div className="card-header">
                <h2>Today&apos;s Schedule</h2>
                <Link to="/schedule" className="btn btn-sm btn-outline">
                  View Full
                </Link>
              </div>
              <div className="card-body">
                {todaySchedule.length === 0 ? (
                  <p className="text-muted">
                    No schedule yet. Generate your timetable from the Schedule
                    page.
                  </p>
                ) : (
                  <div className="schedule-list">
                    {todaySchedule.map((slot) => (
                      <div
                        key={slot._id}
                        className={`schedule-item schedule-item-${slot.status}`}
                      >
                        <div className="schedule-time">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                        <div className="schedule-content">
                          {slot.task ? (
                            <>
                              <div className="schedule-task-title">
                                {slot.task.title}
                              </div>
                              {slot.task.subject && (
                                <span
                                  className="schedule-subject-badge"
                                  style={{
                                    backgroundColor: slot.task.subject.color,
                                  }}
                                >
                                  {slot.task.subject.title}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">Free time</span>
                          )}
                        </div>
                        <span className="schedule-status">{slot.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

