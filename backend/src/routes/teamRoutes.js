import express from 'express';
import {
  createTeam,
  getMyTeam,
  getTeams,
  joinRequest,
  handleRequest,
  getTeamMessages,
  saveMessage
} from '../controllers/teamController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTeams);
router.post('/', protect, createTeam);
router.get('/me', protect, getMyTeam);

router.post('/:id/join', protect, joinRequest);
router.put('/:id/request', protect, handleRequest);

router.get('/:id/messages', protect, getTeamMessages);
router.post('/:id/messages', protect, saveMessage);

export default router;