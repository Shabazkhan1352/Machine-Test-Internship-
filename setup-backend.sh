#!/bin/bash

echo "🚀 Setting up MERN backend..."

# Create project folder
mkdir mern-backend && cd mern-backend

# Initialize Node project
npm init -y

# Enable ES Modules
jq '.type="module"' package.json > temp.json && mv temp.json package.json

# Install dependencies
npm install express mongoose dotenv jsonwebtoken bcryptjs multer csv-parser xlsx cors

# Create file structure
mkdir config controllers routes models middlewares scripts uploads

# Create index.js (entry point)
cat <<EOF > index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import listRoutes from './routes/listRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(\`🚀 Server running on port \${process.env.PORT}\`);
    });
  })
  .catch(err => console.error(err));
EOF

# .env example
cat <<EOF > .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_test
JWT_SECRET=your_jwt_secret
EOF

# ------------------ MODELS ------------------

# User model
cat <<EOF > models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
EOF

# Agent model
cat <<EOF > models/Agent.js
import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model('Agent', agentSchema);
EOF

# List item model
cat <<EOF > models/ListItem.js
import mongoose from 'mongoose';

const listItemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
});

export default mongoose.model('ListItem', listItemSchema);
EOF

# ------------------ MIDDLEWARES ------------------

# JWT middleware
cat <<EOF > middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};
EOF

# Multer file upload config
cat <<EOF > middlewares/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Only .csv, .xlsx, .xls files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
EOF

# ------------------ CONTROLLERS ------------------

# Auth controller
cat <<EOF > controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
EOF

# Agent controller
cat <<EOF > controllers/agentController.js
import Agent from '../models/Agent.js';
import bcrypt from 'bcryptjs';

export const addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Agent already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new Agent({ name, email, mobile, password: hashedPassword });

    await newAgent.save();
    res.status(201).json({ message: 'Agent created successfully', agent: newAgent });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
EOF

# List controller
cat <<EOF > controllers/listController.js
import xlsx from 'xlsx';
import ListItem from '../models/ListItem.js';
import Agent from '../models/Agent.js';

const parseFile = async (buffer, originalname) => {
  const ext = originalname.split('.').pop();

  if (ext === 'csv') {
    const lines = buffer.toString('utf8').split('\\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const [firstName, phone, notes] = lines[i].split(',');
      if (!firstName || !phone) continue;
      data.push({ firstName: firstName.trim(), phone: phone.trim(), notes: notes?.trim() || '' });
    }
    return data;
  }

  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return data.map(row => ({
    firstName: row.FirstName,
    phone: row.Phone?.toString(),
    notes: row.Notes || ''
  }));
};

export const uploadList = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const parsedData = await parseFile(buffer, originalname);
    const createdItems = await ListItem.insertMany(parsedData);
    res.status(201).json({ message: 'List uploaded', count: createdItems.length });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const distributeLists = async (req, res) => {
  try {
    const agents = await Agent.find();
    if (agents.length < 1) return res.status(400).json({ message: 'No agents found' });

    const items = await ListItem.find({ assignedTo: { $exists: false } });
    if (items.length === 0) return res.status(200).json({ message: 'No unassigned items' });

    let assigned = [];
    for (let i = 0; i < items.length; i++) {
      const agent = agents[i % agents.length];
      items[i].assignedTo = agent._id;
      assigned.push(items[i]);
    }

    const bulkOps = assigned.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { assignedTo: item.assignedTo } }
      }
    }));

    await ListItem.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Distributed', total: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Distribution failed', error: err.message });
  }
};

export const getAgentList = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const data = await ListItem.find({ assignedTo: agentId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};
EOF

# ------------------ ROUTES ------------------

# Auth routes
cat <<EOF > routes/authRoutes.js
import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', login);

export default router;
EOF

# Agent routes
cat <<EOF > routes/agentRoutes.js
import express from 'express';
import { addAgent, getAllAgents } from '../controllers/agentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, addAgent);
router.get('/', verifyToken, getAllAgents);

export default router;
EOF

# List routes
cat <<EOF > routes/listRoutes.js
import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { uploadList, distributeLists, getAgentList } from '../controllers/listController.js';

const router = express.Router();

router.post('/upload', verifyToken, upload.single('file'), uploadList);
router.post('/distribute', verifyToken, distributeLists);
router.get('/agent/:agentId', verifyToken, getAgentList);

export default router;
EOF

# ------------------ SCRIPT TO CREATE ADMIN ------------------

cat <<EOF > scripts/createAdmin.js
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
EOF

echo "✅ Backend structure complete. Run this to start:"
echo "   node scripts/createAdmin.js"
echo "   npm run dev OR node index.js"
