export function About() {
  const highlights = [
    { year: '9/2025 - Now', title: 'Intern Mobile Developer', description: 'Building mobile applications' },
    // { year: '1/2026 - Now', title: 'Intern Web Developer', description: 'Building web automation, tools, scapers' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground animate-fade-in">
            About Me
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            A passionate developer crafting digital experiences with code and creativity
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Bio */}
          <div className="animate-fade-in-up">
            <div className="space-y-6">
              <p className="text-lg text-foreground/90 leading-relaxed">
                I'm currently studying Information Technology at Da Nang University of Science and Technology.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I enjoy exploring new technologies and creating software solutions. I'm also continuously learning more about Web, Mobile, and Artificial Intelligence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Feel free to reach out if you'd like to collaborate, discuss interesting tech topics, or need pro bono consulting or volunteering support. I'm always open to meaningful conversations.
              </p>
            </div>
          </div>

          {/* Right - Timeline */}
          <div className="animate-fade-in-up-delayed">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-8">
                {highlights.map((item, index) => (
                  <div key={index} className="relative pl-12">
                    {/* Dot */}
                    <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:bg-card transition-colors">
                      <span className="text-sm font-medium text-primary">{item.year}</span>
                      <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
