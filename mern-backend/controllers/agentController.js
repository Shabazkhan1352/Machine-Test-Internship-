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


// subagents

export const createSubAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const agentId = req.user.id;

  try {
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const subagent = new Agent({ name, email, mobile, password: hashed, createdBy: agentId });

    await subagent.save();
    res.status(201).json({ message: 'Subagent created', subagent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating subagent', error: err.message });
  }
};
