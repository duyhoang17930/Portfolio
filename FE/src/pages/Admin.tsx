import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Settings, Plus, Pencil, Trash2, X, FolderKanban } from 'lucide-react';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Admin only area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
            <Settings className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground animate-fade-in">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            Manage your portfolio projects and content
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              {editingProject ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              <h2 className="text-xl font-semibold text-foreground">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              {editingProject && (
                <button
                  onClick={resetForm}
                  className="ml-auto p-2 text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Node.js, MySQL"
                  className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Repo URL</label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50"
                />
                <label htmlFor="featured" className="text-sm text-foreground">Featured Project</label>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition font-medium"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>

        {/* Projects List */}
        <div className="animate-fade-in-up-delayed">
          <div className="flex items-center gap-3 mb-6">
            <FolderKanban className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
            <span className="text-sm font-normal text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {projects.length}
            </span>
          </div>

          <div className="grid gap-4">
            {projects.map(project => (
              <div key={project.id} className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      {project.featured && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech) => (
                        <span key={tech} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary/50"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition rounded-lg hover:bg-secondary/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-card/20 rounded-xl border border-dashed border-border">
                No projects yet. Create your first project above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
