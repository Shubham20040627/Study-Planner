import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: [],
    isFavorite: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchSubjects();
    if (id && id !== 'new') {
      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchNote = async () => {
    try {
      const response = await api.get(`/notes/${id}`);
      setFormData({
        title: response.data.title || '',
        content: response.data.content || '',
        subject: response.data.subject?._id || response.data.subject || '',
        tags: response.data.tags || [],
        isFavorite: response.data.isFavorite || false,
      });
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Error loading note');
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

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const toggleFavorite = () => {
    setFormData({
      ...formData,
      isFavorite: !formData.isFavorite,
    });
  };

  const getWordCount = () => {
    if (!formData.content) return 0;
    return formData.content.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return formData.content ? formData.content.length : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id && id !== 'new') {
        await api.put(`/notes/${id}`, formData);
      } else {
        await api.post('/notes', formData);
      }
      navigate('/notes');
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.response?.data?.message || 'Error saving note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          {id && id !== 'new' ? 'Edit Note' : 'New Note'}
        </h1>
      </div>

      <div className="card">
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
            <div className="form-group">
              <label htmlFor="tags">
                Tags
                <span className="form-label-hint">(Press Enter to add a tag)</span>
              </label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
                className="form-input"
              />
              {formData.tags.length > 0 && (
                <div className="note-tags-container">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="note-tag-editor">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="note-tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="content">
                Content
                <span className="form-label-hint">
                  ({getWordCount()} words, {getCharacterCount()} characters)
                </span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="15"
                className="form-textarea"
                placeholder="Write your notes here..."
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={toggleFavorite}
                  className="form-checkbox"
                />
                <span className="form-checkbox-text">
                  {formData.isFavorite ? '⭐ Favorite' : '☆ Mark as Favorite'}
                </span>
              </label>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/notes')}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;






