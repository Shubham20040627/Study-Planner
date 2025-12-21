import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Please provide a subject'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: 1,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date'],
    },
    preferredTime: {
      type: String,
      default: '09:00',
      validate: {
        validator: function(v) {
          // Validate HH:MM format
          return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Preferred time must be in HH:MM format (24-hour)',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Task', taskSchema);




