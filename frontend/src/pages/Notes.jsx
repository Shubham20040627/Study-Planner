import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import NotePreview from '../components/NotePreview.jsx';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]); // Store all notes for tag list
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const searchTimeoutRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterSubject) params.append('subject', filterSubject);
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (showFavorites) params.append('favorite', 'true');
      if (selectedTag) params.append('tag', selectedTag);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const [notesRes, subjectsRes, allNotesRes] = await Promise.all([
        api.get(`/notes?${params.toString()}`),
        api.get('/subjects'),
        // Fetch all notes (no filters) for tag dropdown
        api.get('/notes'),
      ]);
      setNotes(notesRes.data);
      setAllNotes(allNotesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSubject, debouncedSearchQuery, showFavorites, selectedTag, sortBy, sortOrder]);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await api.delete(`/notes/${id}`);
      fetchData();
      // Close modal if the deleted note was open
      if (selectedNote && selectedNote._id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert(error.response?.data?.message || 'Error deleting note');
    }
  };

  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notes/${id}/favorite`);
      fetchData();
      // Update selected note if it's open
      if (selectedNote && selectedNote._id === id) {
        const updatedNote = notes.find((n) => n._id === id);
        if (updatedNote) {
          setSelectedNote({ ...updatedNote, isFavorite: !updatedNote.isFavorite });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleExportNote = (note, e) => {
    e.stopPropagation();
    const content = `Title: ${note.title}\nSubject: ${note.subject?.title || 'N/A'}\nTags: ${note.tags?.join(', ') || 'None'}\nCreated: ${new Date(note.createdAt).toLocaleString()}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}\n\n${note.content || 'No content'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get all unique tags from all notes (not just filtered)
  const getAllTags = () => {
    const tagSet = new Set();
    allNotes.forEach((note) => {
      if (note.tags && note.tags.length > 0) {
        note.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  const handleEditClick = (id, e) => {
    e.stopPropagation(); // Prevent opening modal when clicking edit
  };

  const handleCardClick = (note) => {
    setSelectedNote(note);
  };

  const filteredNotes = notes; // Notes are already filtered by backend

  const getNotesCountForSubject = (subjectId) => {
    return allNotes.filter((note) => {
      if (!note.subject) return false;
      return (
        note.subject._id === subjectId ||
        note.subject === subjectId
      );
    }).length;
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <>
      <div className={`container ${selectedNote ? 'notes-page-dimmed' : ''}`}>
        <div className="page-header">
          <h1 className="page-title">Notes</h1>
          <Link to="/notes/new" className="btn btn-primary">
            + New Note
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="notes-filters-container">
          <div className="notes-search-container">
            <div className="notes-search-wrapper">
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notes-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="notes-search-clear"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {debouncedSearchQuery && (
              <div className="notes-search-status">
                Searching for: "{debouncedSearchQuery}"
              </div>
            )}
          </div>
          <div className="notes-filter-controls">
            <button
              className={`btn btn-sm ${showFavorites ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? '⭐ Favorites' : '☆ Favorites'}
            </button>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="notes-filter-select"
            >
              <option value="">All Tags</option>
              {getAllTags().map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="notes-filter-select"
            >
              <option value="updatedAt-desc">Sort: Recently Updated</option>
              <option value="updatedAt-asc">Sort: Oldest Updated</option>
              <option value="createdAt-desc">Sort: Newest First</option>
              <option value="createdAt-asc">Sort: Oldest First</option>
              <option value="title-asc">Sort: Title (A-Z)</option>
              <option value="title-desc">Sort: Title (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="notes-subjects-row">
          <button
            type="button"
            className={`notes-subject-card ${!filterSubject ? 'active' : ''}`}
            onClick={() => setFilterSubject('')}
          >
            <div className="notes-subject-card-inner">
              <div className="notes-subject-color notes-subject-color-all" />
              <div className="notes-subject-text">
                <div className="notes-subject-title">All Subjects</div>
                <div className="notes-subject-meta">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </div>
              </div>
            </div>
          </button>

          {subjects.map((subject) => {
            const count = getNotesCountForSubject(subject._id);
            return (
              <button
                key={subject._id}
                type="button"
                className={`notes-subject-card ${
                  filterSubject === subject._id ? 'active' : ''
                }`}
                onClick={() =>
                  setFilterSubject(
                    filterSubject === subject._id ? '' : subject._id
                  )
                }
              >
                <div className="notes-subject-card-inner">
                  <div
                    className="notes-subject-color"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="notes-subject-text">
                    <div className="notes-subject-title">{subject.title}</div>
                    <div className="notes-subject-meta">
                      {count} {count === 1 ? 'note' : 'notes'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <p className="text-muted">No notes yet. Create one to get started!</p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className="note-card note-card-clickable"
                onClick={() => handleCardClick(note)}
              >
                <div className="note-card-header">
                  <div className="note-card-title-row">
                    <h3>{note.title}</h3>
                    <button
                      onClick={(e) => handleToggleFavorite(note._id, e)}
                      className="note-favorite-btn"
                      title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {note.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <div className="note-card-badges">
                    {note.subject && (
                      <span
                        className="note-subject-badge"
                        style={{ backgroundColor: note.subject.color }}
                      >
                        {note.subject.title}
                      </span>
                    )}
                    {note.tags && note.tags.length > 0 && (
                      <div className="note-tags">
                        {note.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="note-tag">#{tag}</span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="note-tag-more">+{note.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="note-card-body">
                  <p className="note-preview">
                    {note.content && note.content.length > 150
                      ? `${note.content.substring(0, 150)}...`
                      : note.content || 'No content'}
                  </p>
                  <div className="note-meta">
                    Updated:{' '}
                    {new Date(note.updatedAt).toLocaleDateString()}
                    {note.content && (
                      <span className="note-word-count">
                        • {note.content.split(/\s+/).filter((word) => word.length > 0).length} words
                      </span>
                    )}
                  </div>
                </div>
                <div className="note-card-actions" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/notes/${note._id}`}
                    className="btn btn-sm btn-primary"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => handleExportNote(note, e)}
                    className="btn btn-sm btn-outline"
                    title="Export note"
                  >
                    📥 Export
                  </button>
                  <button
                    onClick={(e) => handleDelete(note._id, e)}
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

      {/* Note Preview Modal */}
      {selectedNote && (
        <NotePreview
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </>
  );
};

export default Notes;


