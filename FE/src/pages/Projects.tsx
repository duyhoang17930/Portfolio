import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    name: 'Phone Store Management',
    description: 'A full-featured online phone store with real-time inventory management, secure payments, and admin dashboard.',
    tech: ['React', 'Spring Boot', 'TailwindCSS', 'MySQL'],
    color: 'from-blue-500/20 to-purple-500/20',
    link: 'https://github.com/HuynhTienNhat/Techsphere',
  },
  {
    name: 'Remote Desktop App',
    description: 'A remote desktop app that lets users access and control a computer from a mobile device.',
    tech: ['Dart', 'Flutter'],
    color: 'from-green-500/20 to-teal-500/20',
    link: 'https://play.google.com/store/apps/details?id=org.termuxstudio.vncviewer',
  },
  {
    name: 'File Zip Manager',
    description: 'A simple app to compress and extract files in ZIP format for easy storage.',
    tech: ['HTML', 'CSS', 'JavaScript', 'JSP', 'Servlet', "Firebase"],
    color: 'from-orange-500/20 to-red-500/20',
    link: 'https://github.com/CongTien13/ltm_ZipFile',
  },
  {
    name: 'Football Field Management',
    description: 'A desktop application for managing football field bookings, schedules, and customer information.',
    tech: ['C++', 'SFML'],
    color: 'from-pink-500/20 to-rose-500/20',
    link: 'https://github.com/duyhoang17930/PBL2-football-field-management',
  },
];

export function Projects() {
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
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={project.name}
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
                  {project.name}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
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
