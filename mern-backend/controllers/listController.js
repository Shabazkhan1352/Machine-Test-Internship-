import xlsx from 'xlsx';
import ListItem from '../models/ListItem.js';
import Agent from '../models/Agent.js';

// Helper function to parse uploaded file (CSV or Excel)
const parseFile = async (buffer, originalname) => {
  const ext = originalname.split('.').pop().toLowerCase();

  if (ext === 'csv') {
    const lines = buffer.toString('utf8').split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const [firstName, phone, notes] = lines[i].split(',');
      if (!firstName || !phone) continue;
      data.push({
        firstName: firstName.trim(),
        phone: phone.trim(),
        notes: notes?.trim() || ''
      });
    }

    return data;
  }

  // Parse Excel (.xlsx, .xls)
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return data.map(row => ({
    firstName: row.FirstName,
    phone: row.Phone?.toString(),
    notes: row.Notes || ''
  }));
};

// Upload and store list items
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

// Distribute list items equally among agents
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

// Get all list items assigned to a specific agent
export const getAgentList = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const data = await ListItem.find({ assignedTo: agentId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};
