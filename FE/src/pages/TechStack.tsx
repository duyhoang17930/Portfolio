const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'MySQL', 'Prisma'] },
  { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'Linux'] },
  { category: 'Other', items: ['REST APIs', 'GraphQL', 'Authentication', 'CI/CD'] },
];

export function TechStack() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Tech Stack</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category} className="border border-border rounded-lg p-4 bg-card">
            <h2 className="text-xl font-semibold mb-4 text-foreground">{group.category}</h2>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
