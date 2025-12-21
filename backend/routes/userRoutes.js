import express from 'express';
import {
  getUserProfile,
  updateUserSettings,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
// router.put('/settings', updateUserSettings);

export default router;










