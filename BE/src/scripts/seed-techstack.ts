import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const techStackCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: { type: [String], default: [] },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

const TechStackCategory = mongoose.model('TechStackCategory', techStackCategorySchema);

const seedData = [
  { name: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'Dart'], displayOrder: 1 },
  { name: 'Frontend', items: ['HTML', 'CSS', 'React', 'Next.js', 'Tailwind CSS'], displayOrder: 2 },
  { name: 'Mobile Development', items: ['Flutter', 'Android (Java)'], displayOrder: 3 },
  { name: 'Backend', items: ['Spring Boot', 'MySQL'], displayOrder: 4 },
  { name: 'Tools & Platforms', items: ['Git', 'GitHub'], displayOrder: 5 }
];

async function seed() {
  const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/portfolio';

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await TechStackCategory.deleteMany({});
    console.log('Cleared existing techstack data');

    // Insert new data
    await TechStackCategory.insertMany(seedData);
    console.log('Techstack data seeded successfully');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
