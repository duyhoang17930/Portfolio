import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Settings, Plus, Pencil, Trash2, X, FolderKanban, Code2 } from 'lucide-react';
import type { TechStackCategory } from '../types';

interface Project {
  _id: string;
  title: string;
  description?: string;
  techStack?: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  displayOrder?: number;
}

type Tab = 'projects' | 'techstack';

export function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [techstack, setTechstack] = useState<TechStackCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Project state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    demoUrl: '',
    repoUrl: '',
    featured: false,
    displayOrder: 0
  });

  // TechStack state
  const [editingCategory, setEditingCategory] = useState<TechStackCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    items: '',
    displayOrder: 0
  });

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      setLoading(false);
      return;
    }
    if (user?.isAdmin) {
      fetchProjects();
      fetchTechStack();
    }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchTechStack = async () => {
    try {
      const { data } = await api.get('/api/techstack');
      setTechstack(data);
    } catch (error) {
      console.error('Failed to fetch techstack:', error);
    } finally {
      setLoading(false);
    }
  };

  // Project handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        techStack: projectForm.techStack.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingProject) {
        await api.put(`/api/projects/${editingProject._id}`, payload);
      } else {
        await api.post('/api/projects', payload);
      }

      fetchProjects();
      resetProjectForm();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
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

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectForm({
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

  // TechStack handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: categoryForm.name,
        items: categoryForm.items.split(',').map(t => t.trim()).filter(Boolean),
        displayOrder: categoryForm.displayOrder
      };

      if (editingCategory) {
        await api.put(`/api/techstack/${editingCategory._id}`, payload);
      } else {
        await api.post('/api/techstack', payload);
      }

      fetchTechStack();
      resetCategoryForm();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/api/techstack/${id}`);
      fetchTechStack();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCategoryEdit = (category: TechStackCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      items: category.items.join(', '),
      displayOrder: category.displayOrder
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      items: '',
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

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('techstack')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'techstack'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code2 className="w-5 h-5" />
            Tech Stack
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
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
                      onClick={resetProjectForm}
                      className="ml-auto p-2 text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Display Order</label>
                      <input
                        type="number"
                        value={projectForm.displayOrder}
                        onChange={e => setProjectForm({ ...projectForm, displayOrder: Number(e.target.value) })}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={projectForm.techStack}
                      onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })}
                      placeholder="React, Node.js, MySQL"
                      className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Image URL</label>
                      <input
                        type="url"
                        value={projectForm.imageUrl}
                        onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Demo URL</label>
                      <input
                        type="url"
                        value={projectForm.demoUrl}
                        onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Repo URL</label>
                    <input
                      type="url"
                      value={projectForm.repoUrl}
                      onChange={e => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
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
                  <div key={project._id} className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
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
                          onClick={() => handleProjectEdit(project)}
                          className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary/50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleProjectDelete(project._id)}
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
          </>
        )}

        {/* TechStack Tab */}
        {activeTab === 'techstack' && (
          <>
            {/* Form Section */}
            <div className="mb-12 animate-fade-in-up">
              <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  {editingCategory ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                  <h2 className="text-xl font-semibold text-foreground">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  {editingCategory && (
                    <button
                      onClick={resetCategoryForm}
                      className="ml-auto p-2 text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleCategorySubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Category Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="e.g., Frontend, Backend"
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Display Order</label>
                      <input
                        type="number"
                        value={categoryForm.displayOrder}
                        onChange={e => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                        className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Tech Items (comma separated)</label>
                    <input
                      type="text"
                      value={categoryForm.items}
                      onChange={e => setCategoryForm({ ...categoryForm, items: e.target.value })}
                      placeholder="React, Next.js, Tailwind CSS"
                      className="w-full border border-border rounded-xl px-4 py-3 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition font-medium"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </form>
              </div>
            </div>

            {/* Categories List */}
            <div className="animate-fade-in-up-delayed">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Tech Stack Categories</h2>
                <span className="text-sm font-normal text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                  {techstack.length}
                </span>
              </div>

              <div className="grid gap-4">
                {techstack.map(category => (
                  <div key={category._id} className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                          <span className="text-xs text-muted-foreground">Order: {category.displayOrder}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.items.map((item) => (
                            <span key={item} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCategoryEdit(category)}
                          className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary/50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(category._id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition rounded-lg hover:bg-secondary/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {techstack.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground bg-card/20 rounded-xl border border-dashed border-border">
                    No tech stack categories yet. Create your first category above.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
