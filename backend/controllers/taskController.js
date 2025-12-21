import Task from '../models/Task.js';

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged in user
 */
export const getTasks = async (req, res) => {
  try {
    const { completed, subject } = req.query;
    const query = { user: req.user._id };

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    if (subject) {
      query.subject = subject;
    }

    const tasks = await Task.find(query)
      .populate('subject', 'title color')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
export const createTask = async (req, res) => {
  try {
    const { title, subject, durationMinutes, dueDate, preferredTime } = req.body;

    const task = await Task.create({
      title,
      subject,
      durationMinutes,
      dueDate: new Date(dueDate),
      preferredTime: preferredTime || '09:00',
      user: req.user._id,
    });

    const populatedTask = await Task.findById(task._id).populate(
      'subject',
      'title color'
    );

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, subject, durationMinutes, dueDate, preferredTime, completed } =
      req.body;

    if (title !== undefined) task.title = title;
    if (subject !== undefined) task.subject = subject;
    if (durationMinutes !== undefined) task.durationMinutes = durationMinutes;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (preferredTime !== undefined) task.preferredTime = preferredTime;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate(
      'subject',
      'title color'
    );

    res.json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




