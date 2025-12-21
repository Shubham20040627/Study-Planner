import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api.js';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    timezone: 'UTC',
    studyHoursPerDay: 6,
    preferredTime: '09:00',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        timezone: user.timezone || 'UTC',
        studyHoursPerDay: user.studyHoursPerDay || 6,
        preferredTime: user.preferredTime || '09:00',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/user/settings', formData);
      updateUser({ ...user, ...response.data });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(error.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  // Get common timezones
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">

      <div className="card">
        <div className="card-header">
          <h2>Account Information</h2>
        </div>
        <div className="card-body">
          <div className="info-row">
            <strong>Name:</strong> {user?.name}
          </div>
          <div className="info-row">
            <strong>Email:</strong> {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;










