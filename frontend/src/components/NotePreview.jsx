import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotePreview = ({ note, onClose }) => {
  const navigate = useNavigate();

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditClick = () => {
    onClose();
    navigate(`/notes/${note._id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!note) return null;

  return (
    <div className="note-modal-overlay" onClick={handleOverlayClick}>
      <div className="note-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="note-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className="note-modal-close-icon">×</span>
        </button>

        <div className="note-modal-content">
          {/* Header */}
          <div className="note-modal-header">
            <div className="note-modal-title-section">
              <div className="note-modal-title-row">
                <h1 className="note-modal-title">{note.title}</h1>
                {note.isFavorite && (
                  <span className="note-modal-favorite">⭐</span>
                )}
              </div>
              <div className="note-modal-badges">
                {note.subject && (
                  <span
                    className="note-modal-subject-badge"
                    style={{ backgroundColor: note.subject.color }}
                  >
                    {note.subject.title}
                  </span>
                )}
                {note.tags && note.tags.length > 0 && (
                  <div className="note-modal-tags">
                    {note.tags.map((tag, idx) => (
                      <span key={idx} className="note-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="note-modal-meta">
            <div className="note-modal-meta-item">
              <span className="note-modal-meta-label">Created:</span>
              <span className="note-modal-meta-value">
                {formatDate(note.createdAt)}
              </span>
            </div>
            <div className="note-modal-meta-item">
              <span className="note-modal-meta-label">Updated:</span>
              <span className="note-modal-meta-value">
                {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="note-modal-body">
            <div className="note-modal-text">
              {note.content ? (
                <div className="note-content-formatted">
                  {note.content.split('\n').map((line, index) => (
                    <p key={index}>{line || '\u00A0'}</p>
                  ))}
                </div>
              ) : (
                <p className="note-content-empty">No content available</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="note-modal-actions">
            <button
              onClick={handleEditClick}
              className="btn btn-primary note-modal-edit-btn"
            >
              <span className="note-modal-edit-icon">✏️</span>
              Open in Editor
            </button>
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePreview;





