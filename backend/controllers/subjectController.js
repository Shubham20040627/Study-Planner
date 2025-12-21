import Subject from '../models/Subject.js';

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects for logged in user
 */
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/subjects
 * @desc    Create a new subject
 */
export const createSubject = async (req, res) => {
  try {
    const { title, color } = req.body;

    const subject = await Subject.create({
      title,
      color: color || '#3B82F6',
      user: req.user._id,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/subjects/:id
 * @desc    Update a subject
 */
export const updateSubject = async (req, res) => {
  try {
    const { title, color } = req.body;

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.title = title || subject.title;
    subject.color = color || subject.color;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete a subject
 */
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await Subject.deleteOne({ _id: req.params.id });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};










