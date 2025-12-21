import { useState, useEffect } from 'react';
import api from '../api/api.js';

const Schedule = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/timetable/day?date=${selectedDate}`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const startDate = selectedDate;
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6); // Generate for a week

      await api.post('/timetable/generate', {
        startDate,
        endDate: endDate.toISOString().split('T')[0],
      });

      // Fetch the updated schedule
      await fetchSchedule();
      alert('Timetable generated successfully!');
    } catch (error) {
      console.error('Error generating timetable:', error);
      alert(error.response?.data?.message || 'Error generating timetable');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkDone = async (slotId) => {
    try {
      await api.post(`/timetable/${slotId}/done`);
      fetchSchedule();
    } catch (error) {
      console.error('Error marking slot as done:', error);
      alert(error.response?.data?.message || 'Error updating slot');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSlotDurationMinutes = (slot) => {
    if (!slot?.start || !slot?.end) return '';
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    const diffMs = end - start;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return diffMinutes;
  };

  const getHourSlots = () => {
    // Create hour slots from 6 AM to 11 PM
    const hours = [];
    for (let i = 6; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getSlotForHour = (hour) => {
    return slots.find((slot) => {
      const slotHour = new Date(slot.start).getHours();
      return slotHour === hour;
    });
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Schedule</h1>
        <div className="schedule-controls">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
          />
          <button
            onClick={handleGenerate}
            className="btn btn-primary"
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>
      </div>

      <div className="schedule-container">
        <div className="timetable">
          {getHourSlots().map((hour) => {
            const slot = getSlotForHour(hour);
            const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

            return (
              <div key={hour} className="timetable-row">
                <div className="timetable-hour">{hourLabel}</div>
                <div className="timetable-slot-container">
                  {slot ? (
                    <div
                      className={`timetable-slot timetable-slot-${slot.status}`}
                      style={{
                        backgroundColor: slot.task?.subject?.color
                          ? `${slot.task.subject.color}20`
                          : '#f3f4f6',
                        borderLeftColor: slot.task?.subject?.color || '#3B82F6',
                      }}
                    >
                      <div className="timetable-slot-header">
                        <div className="timetable-slot-time">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                        {slot.status !== 'done' && (
                          <button
                            onClick={() => handleMarkDone(slot._id)}
                            className="btn btn-sm btn-success"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                      {slot.task && (
                        <div className="timetable-slot-content">
                          <div className="timetable-slot-title">
                            {slot.task.title}
                          </div>
                          {slot.task.subject && (
                            <span
                              className="timetable-slot-subject"
                              style={{
                                backgroundColor: slot.task.subject.color,
                              }}
                            >
                              {slot.task.subject.title}
                            </span>
                          )}
                          <span className="timetable-slot-duration">
                            {getSlotDurationMinutes(slot)} min
                          </span>
                        </div>
                      )}
                      <div className="timetable-slot-status">
                        Status: {slot.status}
                        {slot.autoGenerated && (
                          <span className="auto-generated-badge">Auto</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="timetable-slot-empty">Free time</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;




