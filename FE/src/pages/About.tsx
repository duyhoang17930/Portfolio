export function About() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-foreground">About Me</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p className="text-lg text-muted-foreground">
          Your personal story and background here. I'm a passionate developer with experience
          building web applications using modern technologies.
        </p>
        <p className="text-lg text-muted-foreground mt-4">
          When I'm not coding, you can find me exploring new technologies, contributing to open
          source, or sharing knowledge with the community.
        </p>
      </div>
    </div>
  );
}
