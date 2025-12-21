import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 Study Planner
        </Link>
        <div className="navbar-menu">
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/subjects"
            className={`navbar-link ${isActive('/subjects') ? 'active' : ''}`}
          >
            Subjects
          </Link>
          <Link
            to="/tasks"
            className={`navbar-link ${isActive('/tasks') ? 'active' : ''}`}
          >
            Tasks
          </Link>
          <Link
            to="/schedule"
            className={`navbar-link ${isActive('/schedule') ? 'active' : ''}`}
          >
            Schedule
          </Link>
          <Link
            to="/notes"
            className={`navbar-link ${isActive('/notes') ? 'active' : ''}`}
          >
            Notes
          </Link>
          <Link
            to="/settings"
            className={`navbar-link ${isActive('/settings') ? 'active' : ''}`}
          >
            Settings
          </Link>
        </div>
        <div className="navbar-user">
          <span className="navbar-user-name">{user?.name}</span>
          <button onClick={logout} className="btn btn-sm btn-outline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;










