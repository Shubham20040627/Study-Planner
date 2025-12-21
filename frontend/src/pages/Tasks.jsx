import { useState, useEffect } from 'react';
import api from '../api/api.js';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    durationMinutes: 60,
    dueDate: '',
    preferredTime: '09:00',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/subjects'),
      ]);
      setTasks(tasksRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      alert(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      subject: task.subject._id || task.subject,
      durationMinutes: task.durationMinutes || 60,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      preferredTime: task.preferredTime || '09:00',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.message || 'Error deleting task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      durationMinutes: 60,
      dueDate: '',
      preferredTime: '09:00',
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      <div className="filter-tabs">
        <button
          onClick={() => setFilter('all')}
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="durationMinutes">Duration (minutes)</label>
                  <input
                    type="number"
                    id="durationMinutes"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time</label>
                  <input
                    type="time"
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <p className="text-muted">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-card-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className="task-checkbox"
                />
                <h3 className="task-card-title">{task.title}</h3>
              </div>
              <div className="task-card-body">
                {task.subject && (
                  <span
                    className="task-subject-badge"
                    style={{ backgroundColor: task.subject.color }}
                  >
                    {task.subject.title}
                  </span>
                )}
                <span className="task-meta">
                  {task.durationMinutes} min • Due:{' '}
                  {new Date(task.dueDate).toLocaleDateString()}
                  {task.preferredTime && ` • Time: ${task.preferredTime}`}
                </span>
              </div>
              <div className="task-card-actions">
                <button
                  onClick={() => handleEdit(task)}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;




