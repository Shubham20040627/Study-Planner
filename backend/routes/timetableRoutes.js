import express from 'express';
import {
  generateTimetableSlots,
  getDayTimetable,
  updateTimetableSlot,
  markSlotDone,
} from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/generate', generateTimetableSlots);
router.get('/day', getDayTimetable);
router.put('/:id', updateTimetableSlot);
router.post('/:id/done', markSlotDone);

export default router;










