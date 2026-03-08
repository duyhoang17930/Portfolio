import mongoose, { Schema, Document } from 'mongoose';

// User Document interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  provider: string;
  providerId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Project Document interface
export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  techStack?: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// GuestbookMessage Document interface
export interface IGuestbookMessage extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// TechStackCategory Document interface
export interface ITechStackCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  items: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  avatarUrl: { type: String },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

// Project Schema
const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  imageUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

// GuestbookMessage Schema
const guestbookMessageSchema = new Schema<IGuestbookMessage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true }
}, { timestamps: true });

// TechStackCategory Schema
const techStackCategorySchema = new Schema<ITechStackCategory>({
  name: { type: String, required: true },
  items: { type: [String], default: [] },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

// Create indexes
userSchema.index({ provider: 1, providerId: 1 });
projectSchema.index({ displayOrder: 1, createdAt: -1 });
guestbookMessageSchema.index({ createdAt: -1 });

// Export models
export const User = mongoose.model<IUser>('User', userSchema);
export const Project = mongoose.model<IProject>('Project', projectSchema);
export const GuestbookMessage = mongoose.model<IGuestbookMessage>('GuestbookMessage', guestbookMessageSchema);
export const TechStackCategory = mongoose.model<ITechStackCategory>('TechStackCategory', techStackCategorySchema);

// AuthUser type for req.user (compatible with existing code)
export interface AuthUser {
  id: string;
  _id: mongoose.Types.ObjectId;
  provider: string;
  providerId: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  isAdmin: boolean;
}
