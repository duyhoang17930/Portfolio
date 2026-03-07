import { Router, Request } from 'express';
import { GuestbookMessage, User, AuthUser } from '../models/index.js';

const router = Router();

type AuthRequest = Request & { user?: AuthUser };

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await GuestbookMessage.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatarUrl'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create message (auth required)
router.post('/', (req: AuthRequest, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  GuestbookMessage.create({
    userId: req.user.id,
    message: message.trim()
  })
  .then(msg => msg.reload({ include: [{ model: User, as: 'user' }] }))
  .then(msg => res.status(201).json(msg))
  .catch(err => res.status(500).json({ error: 'Failed to create message' }));
});

// Delete own message (auth required)
router.delete('/:id', (req: AuthRequest, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const msgId = parseInt(req.params.id, 10);
  if (isNaN(msgId)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  GuestbookMessage.findByPk(msgId)
    .then(msg => {
      if (!msg) return res.status(404).json({ error: 'Message not found' });
      if (msg.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return msg.destroy().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete message' }));
});

export default router;
