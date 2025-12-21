import User from '../models/User.js';

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * @route   PUT /api/user/settings
 * @desc    Update user settings
 */
export const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { timezone, studyHoursPerDay, preferredTime } = req.body;

    if (timezone) user.timezone = timezone;
    if (studyHoursPerDay !== undefined)
      user.studyHoursPerDay = studyHoursPerDay;
    if (preferredTime) user.preferredTime = preferredTime;

    const updatedUser = await user.save();
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      timezone: updatedUser.timezone,
      studyHoursPerDay: updatedUser.studyHoursPerDay,
      preferredTime: updatedUser.preferredTime,
    };

    res.json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};










