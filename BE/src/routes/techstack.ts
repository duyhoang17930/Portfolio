import { Router, type Router as RouterType } from 'express';
import { TechStackCategory } from '../models/index.js';

const router: RouterType = Router();

// Get all techstack categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await TechStackCategory.find().sort({ displayOrder: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch techstack' });
  }
});

// Create category (admin only)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  try {
    const { name, items, displayOrder } = req.body;
    const category = await TechStackCategory.create({ name, items, displayOrder });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  try {
    const categoryId = req.params.id;
    const category = await TechStackCategory.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const { name, items, displayOrder } = req.body;
    Object.assign(category, { name, items, displayOrder });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  try {
    const categoryId = req.params.id;
    const category = await TechStackCategory.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
