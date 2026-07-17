import { techStackCategories } from '../data/portfolioData';

export function TechStack() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 ">
      <h1 className="text-4xl font-bold mb-8 text-foreground ">Tech Stack</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {techStackCategories.map((group) => (
          <div key={group._id} className="border border-border rounded-lg p-4 bg-card">
            <h2 className="text-xl font-semibold mb-4 text-foreground">{group.name}</h2>
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
        {techStackCategories.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No tech stack items yet.
          </div>
        )}
      </div>
    </div>
  );
}
