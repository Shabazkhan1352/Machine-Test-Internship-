import mongoose from 'mongoose';

// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' } // optionally: 'admin', 'agent', etc.
});


export default mongoose.model('User', userSchema);
