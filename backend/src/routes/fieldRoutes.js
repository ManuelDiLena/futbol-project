import express from 'express';
import {
  getFieldProfile,
  updateFieldProfile,
  getPublicFieldProfile,
} from '../controllers/fieldController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/me')
  .get(protect, authorize('adminField'), getFieldProfile)
  .put(protect, authorize('adminField'), updateFieldProfile);

router.get('/:id', protect, getPublicFieldProfile);

export default router;