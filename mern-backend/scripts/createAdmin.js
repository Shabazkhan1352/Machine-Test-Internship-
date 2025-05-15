import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const hashed = await bcrypt.hash('admin123', 10);
await User.create({ email: 'admin@example.com', password: hashed });

console.log('✅ Admin created');
process.exit();
