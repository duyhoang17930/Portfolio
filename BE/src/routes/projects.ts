import { Router, type Router as RouterType } from 'express';
import { Project } from '../models/index.js';

const router: RouterType = Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project (admin only)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
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
router.put('/:id', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder } = req.body;
    Object.assign(project, { title, description, techStack, imageUrl, demoUrl, repoUrl, featured, displayOrder });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  if (!req.isAuthenticated() || !req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
