import mongoose from 'mongoose';

const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/portfolio';

const userSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  avatarUrl: { type: String },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.name);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      provider: 'local',
      providerId: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      isAdmin: true
    });

    console.log('Admin user created:', admin.name);
    console.log('  - Email:', admin.email);
    console.log('  - Provider:', admin.provider);
    console.log('  - isAdmin:', admin.isAdmin);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

seed();
