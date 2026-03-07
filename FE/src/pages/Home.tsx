export function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center z-10">
        {/* Main Name - Bold Sans-Serif */}
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground mb-4 animate-fade-in">
          Duy Hoàng
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl font-light tracking-[0.3em] text-muted-foreground uppercase animate-fade-in-up">
          Web Developer | Mobile Developer
        </p>

        {/* Tagline */}
        <p className="mt-8 text-base md:text-lg text-muted-foreground/70 max-w-lg mx-auto animate-fade-in-up-delayed">
          Building modern, performant applications with clean code and thoughtful design.
        </p>
      </div>
    </div>
  );
}
