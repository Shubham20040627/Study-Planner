import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Task from '../models/Task.js';
import Note from '../models/Note.js';

dotenv.config();

/**
 * Seed script to populate database with sample data
 */
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});

    console.log('Database cleared');

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'password123', // Will be hashed by pre-save hook
      timezone: 'UTC',
      studyHoursPerDay: 6,
      preferredTime: '09:00',
    });

    console.log('Test user created:', user.email);

    // Create subjects
    const subjects = await Subject.insertMany([
      {
        title: 'Mathematics',
        color: '#EF4444',
        user: user._id,
      },
      {
        title: 'Physics',
        color: '#3B82F6',
        user: user._id,
      },
      {
        title: 'Chemistry',
        color: '#10B981',
        user: user._id,
      },
      {
        title: 'English',
        color: '#F59E0B',
        user: user._id,
      },
    ]);

    console.log('Subjects created:', subjects.length);

    // Create tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.insertMany([
      {
        title: 'Complete Algebra Homework',
        subject: subjects[0]._id,
        durationMinutes: 60,
        dueDate: tomorrow,
        user: user._id,
      },
      {
        title: 'Study Newton\'s Laws',
        subject: subjects[1]._id,
        durationMinutes: 90,
        dueDate: nextWeek,
        user: user._id,
      },
      {
        title: 'Practice Chemical Equations',
        subject: subjects[2]._id,
        durationMinutes: 45,
        dueDate: tomorrow,
        user: user._id,
      },
      {
        title: 'Read Chapter 5',
        subject: subjects[3]._id,
        durationMinutes: 30,
        dueDate: nextWeek,
        user: user._id,
      },
    ]);

    console.log('Tasks created:', tasks.length);

    // Create notes
    const notes = await Note.insertMany([
      {
        title: 'Algebra Formulas',
        content: 'Quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
        subject: subjects[0]._id,
        user: user._id,
      },
      {
        title: 'Physics Notes',
        content: 'F = ma (Force = mass × acceleration)',
        subject: subjects[1]._id,
        user: user._id,
      },
    ]);

    console.log('Notes created:', notes.length);

    console.log('Seed data created successfully!');
    console.log('\nTest user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();




