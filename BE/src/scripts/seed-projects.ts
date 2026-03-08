import mongoose from 'mongoose';

const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/portfolio';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  imageUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const projects = [
  {
    title: 'Phone Store Management',
    description: 'A full-featured online phone store with real-time inventory management, secure payments, and admin dashboard.',
    techStack: ['React', 'Spring Boot', 'TailwindCSS', 'MySQL'],
    repoUrl: 'https://github.com/HuynhTienNhat/Techsphere',
    featured: true,
    displayOrder: 1
  },
  {
    title: 'Remote Desktop App',
    description: 'A remote desktop app that lets users access and control a computer from a mobile device.',
    techStack: ['Dart', 'Flutter'],
    demoUrl: 'https://play.google.com/store/apps/details?id=org.termuxstudio.vncviewer',
    featured: true,
    displayOrder: 2
  },
  {
    title: 'File Zip Manager',
    description: 'A simple app to compress and extract files in ZIP format for easy storage.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'JSP', 'Servlet', 'Firebase'],
    repoUrl: 'https://github.com/CongTien13/ltm_ZipFile',
    featured: true,
    displayOrder: 3
  },
  {
    title: 'Football Field Management',
    description: 'A desktop application for managing football field bookings, schedules, and customer information.',
    techStack: ['C++', 'SFML'],
    repoUrl: 'https://github.com/duyhoang17930/PBL2-football-field-management',
    featured: true,
    displayOrder: 4
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert new projects
    const result = await Project.insertMany(projects);
    console.log(`Seeded ${result.length} projects:`);
    result.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding projects:', err);
    process.exit(1);
  }
}

seed();
