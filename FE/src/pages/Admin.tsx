import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  displayOrder: number;
}

export function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    demoUrl: '',
    repoUrl: '',
    featured: false,
    displayOrder: 0
  });

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      setLoading(false);
      return;
    }
    if (user?.isAdmin) {
      fetchProjects();
    }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingProject) {
        await api.put(`/api/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/api/projects', payload);
      }

      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      techStack: project.techStack?.join(', ') || '',
      imageUrl: project.imageUrl || '',
      demoUrl: project.demoUrl || '',
      repoUrl: project.repoUrl || '',
      featured: project.featured || false,
      displayOrder: project.displayOrder || 0
    });
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      imageUrl: '',
      demoUrl: '',
      repoUrl: '',
      featured: false,
      displayOrder: 0
    });
  };

  if (authLoading || loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">Admin</h1>
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={e => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React, Node.js, MySQL"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Repo URL</label>
            <input
              type="url"
              value={formData.repoUrl}
              onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured">Featured</label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {editingProject ? 'Update' : 'Create'}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
