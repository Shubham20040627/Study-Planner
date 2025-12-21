import mongoose from 'mongoose';
const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a subject title'],
      trim: true,
    },
    color: {
      type: String,
      default: '#3B82F6', // Default blue color
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

export default mongoose.model('Subject', subjectSchema);










