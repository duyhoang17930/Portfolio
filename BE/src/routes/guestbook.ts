import { Router } from 'express';
import mongoose from 'mongoose';
import { GuestbookMessage, User } from '../models/index.js';

const router = Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await GuestbookMessage.find()
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create message (auth required)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const user = req.user as any;
    const userId = new mongoose.Types.ObjectId(user._id);
    const newMessage = await GuestbookMessage.create({
      userId,
      message: message.trim()
    });
    const populatedMsg = await newMessage.populate('userId', 'name avatarUrl');
    const msgObj = populatedMsg.toObject();
    res.status(201).json(msgObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Delete own message (auth required)
router.delete('/:id', async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const msgId = req.params.id;
    const message = await GuestbookMessage.findById(msgId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const user = req.user as any;
    if (message.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await message.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
