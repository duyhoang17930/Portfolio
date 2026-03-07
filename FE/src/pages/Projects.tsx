const projects = [
  {
    name: 'Project 1',
    description: 'A modern web application built with React and Node.js',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    link: '#',
  },
  {
    name: 'Project 2',
    description: 'An e-commerce platform with payment integration',
    tech: ['Next.js', 'TypeScript', 'Stripe'],
    link: '#',
  },
  {
    name: 'Project 3',
    description: 'Real-time collaboration tool',
    tech: ['Vue.js', 'Socket.io', 'Redis'],
    link: '#',
  },
  {
    name: 'Project 4',
    description: 'Analytics dashboard with data visualization',
    tech: ['React', 'D3.js', 'GraphQL'],
    link: '#',
  },
];

export function Projects() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">{project.name}</h2>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tech.map((t) => (
                <span key={t} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
