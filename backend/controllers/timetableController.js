import TimetableSlot from '../models/TimetableSlot.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { generateTimetable, getSlotsForDay } from '../services/scheduler.js';

/**
 * @route   POST /api/timetable/generate
 * @desc    Generate timetable for a date range
 */
export const generateTimetableSlots = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Please provide startDate and endDate' });
    }

    // Get user settings
    const user = await User.findById(req.user._id);
    const userSettings = {
      studyHoursPerDay: user.studyHoursPerDay,
      preferredTime: user.preferredTime,
    };

    // Get all incomplete tasks
    const tasks = await Task.find({
      user: req.user._id,
      completed: false,
    }).populate('subject', 'title color');

    // Generate timetable slots
    const slots = generateTimetable(
      tasks,
      new Date(startDate),
      new Date(endDate),
      userSettings
    );

    // Delete existing slots for this date range (reset timetable for that period)
    await TimetableSlot.deleteMany({
      user: req.user._id,
      start: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // Create new slots
    const createdSlots = await TimetableSlot.insertMany(
      slots.map((slot) => ({
        ...slot,
        user: req.user._id,
      }))
    );

    // Populate task information
    const populatedSlots = await TimetableSlot.find({
      _id: { $in: createdSlots.map((s) => s._id) },
    })
      .populate('task')
      .populate({
        path: 'task',
        populate: { path: 'subject', select: 'title color' },
      })
      .sort({ start: 1 });

    res.status(201).json(populatedSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/timetable/day
 * @desc    Get timetable slots for a specific day
 */
export const getDayTimetable = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Please provide a date' });
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const slots = await TimetableSlot.find({
      user: req.user._id,
      start: { $gte: dayStart, $lte: dayEnd },
    })
      .populate('task')
      .populate({
        path: 'task',
        populate: { path: 'subject', select: 'title color' },
      })
      .sort({ start: 1 });

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/timetable/:id
 * @desc    Update a timetable slot
 */
export const updateTimetableSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!slot) {
      return res.status(404).json({ message: 'Timetable slot not found' });
    }

    const { start, end, task, status } = req.body;

    if (start) slot.start = new Date(start);
    if (end) slot.end = new Date(end);
    if (task !== undefined) slot.task = task;
    if (status) slot.status = status;

    const updatedSlot = await slot.save();
    const populatedSlot = await TimetableSlot.findById(updatedSlot._id)
      .populate('task')
      .populate({
        path: 'task',
        populate: { path: 'subject', select: 'title color' },
      });

    res.json(populatedSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/timetable/:id/done
 * @desc    Mark a timetable slot as done
 */
export const markSlotDone = async (req, res) => {
  try {
    const slot = await TimetableSlot.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!slot) {
      return res.status(404).json({ message: 'Timetable slot not found' });
    }

    slot.status = 'done';
    const updatedSlot = await slot.save();

    const populatedSlot = await TimetableSlot.findById(updatedSlot._id)
      .populate('task')
      .populate({
        path: 'task',
        populate: { path: 'subject', select: 'title color' },
      });

    res.json(populatedSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




