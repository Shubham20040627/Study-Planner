import { useState, useEffect } from 'react';
import api from '../api/api.js';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      fetchSubjects();
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      alert(error.response?.data?.message || 'Error saving subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      title: subject.title,
      color: subject.color,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert(error.response?.data?.message || 'Error deleting subject');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', color: '#3B82F6' });
    setEditingSubject(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Subjects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Subject'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2>{editingSubject ? 'Edit Subject' : 'New Subject'}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form">
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
                <label htmlFor="color">Color</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Update' : 'Create'}
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

      <div className="subjects-grid">
        {subjects.length === 0 ? (
          <p className="text-muted">No subjects yet. Create one to get started!</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject._id} className="subject-card">
              <div
                className="subject-color-bar"
                style={{ backgroundColor: subject.color }}
              ></div>
              <div className="subject-content">
                <h3>{subject.title}</h3>
                <div className="subject-actions">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Subjects;










