import Note from '../models/Note.js';

/**
 * @route   GET /api/notes
 * @desc    Get all notes for logged in user
 */
export const getNotes = async (req, res) => {
  try {
    const { subject, search, favorite, tag, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    const query = { user: req.user._id };

    if (subject) {
      query.subject = subject;
    }

    if (favorite === 'true') {
      query.isFavorite = true;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search functionality
    if (search && search.trim().length > 0) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting options
    const sortOptions = {};
    const validSortFields = ['title', 'createdAt', 'updatedAt', 'subject'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'updatedAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    const notes = await Note.find(query)
      .populate('subject', 'title color')
      .sort(sortOptions);

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note
 */
export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('subject', 'title color');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, subject, tags, isFavorite } = req.body;

    const note = await Note.create({
      title,
      content: content || '',
      subject,
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user._id,
    });

    const populatedNote = await Note.findById(note._id).populate(
      'subject',
      'title color'
    );

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 */
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, subject, tags, isFavorite } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (subject !== undefined) note.subject = subject;
    if (tags !== undefined) note.tags = tags;
    if (isFavorite !== undefined) note.isFavorite = isFavorite;

    const updatedNote = await note.save();
    const populatedNote = await Note.findById(updatedNote._id).populate(
      'subject',
      'title color'
    );

    res.json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/notes/:id/favorite
 * @desc    Toggle favorite status of a note
 */
export const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isFavorite = !note.isFavorite;
    const updatedNote = await note.save();
    const populatedNote = await Note.findById(updatedNote._id).populate(
      'subject',
      'title color'
    );

    res.json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};






