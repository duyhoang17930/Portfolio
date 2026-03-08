import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import api from '../lib/api';

interface Project {
  _id: string;
  title: string;
  description?: string;
  techStack?: string[];
  demoUrl?: string;
  repoUrl?: string;
  color: string;
}

const colorClasses = [
  'from-blue-500/20 to-purple-500/20',
  'from-green-500/20 to-teal-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-pink-500/20 to-rose-500/20',
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await api.get('/api/projects');
        // Add color to each project for frontend display
        const projectsWithColor = data.map((p: any, i: number) => ({
          ...p,
          color: colorClasses[i % colorClasses.length],
        }));
        setProjects(projectsWithColor);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground animate-fade-in">
            Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            Selected works that showcase my skills and passion for building
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <a
              href={project.repoUrl || project.demoUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              key={project._id}
              className="group block relative overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative p-8">
                {/* Project icon/number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                {/* Project info */}
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-secondary/50 text-secondary-foreground rounded-full border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
