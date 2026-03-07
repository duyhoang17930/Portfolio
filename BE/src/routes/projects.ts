import { Router } from 'express';
import { Project } from '../models/index.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder } = req.body;
    const project = await Project.create({
      title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const paramId = req.params.id;
    const idString = Array.isArray(paramId) ? paramId[0] : (paramId ?? '');
    const projectId = Number(idString);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder } = req.body;
    await project.update({ title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const paramId = req.params.id;
    const idString = Array.isArray(paramId) ? paramId[0] : (paramId ?? '');
    const projectId = Number(idString);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
