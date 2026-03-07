export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-foreground">Your Name</h1>
        <p className="text-2xl text-muted-foreground mb-8">Full Stack Developer</p>
        <p className="text-lg text-muted-foreground max-w-xl">
          Welcome to my portfolio. I build modern web applications with React, Node.js, and more.
        </p>
      </div>
    </div>
  );
}
