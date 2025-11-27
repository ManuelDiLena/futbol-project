import express from 'express';
import {
  getPlayerProfile,
  updatePlayerProfile,
  getPublicPlayerProfile,
} from '../controllers/playerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/me')
  .get(protect, authorize('player'), getPlayerProfile)
  .put(protect, authorize('player'), updatePlayerProfile);

router.get('/:id', protect, getPublicPlayerProfile);

export default router;