import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'portfolio',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  provider: { type: DataTypes.STRING(20), allowNull: false },
  providerId: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255) },
  avatarUrl: { type: DataTypes.TEXT },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'users', timestamps: true });

// Project Model
const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  techStack: { type: DataTypes.JSON },
  imageUrl: { type: DataTypes.TEXT },
  demoUrl: { type: DataTypes.STRING(255) },
  repoUrl: { type: DataTypes.STRING(255) },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'projects', timestamps: true });

// GuestbookMessage Model
const GuestbookMessage = sequelize.define('GuestbookMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'guestbook_messages', timestamps: true });

// Associations
User.hasMany(GuestbookMessage, { foreignKey: 'userId', as: 'messages' });
GuestbookMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Project, GuestbookMessage };
