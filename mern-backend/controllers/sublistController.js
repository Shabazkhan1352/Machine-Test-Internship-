import xlsx from 'xlsx';
import SubListitem from '../models/SubListitem.js';
import SubAgent from '../models/SubAgent.js';

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

// Upload and store list items (deduplicated and tracked)
export const uploadList = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const parsedData = await parseFile(buffer, originalname);

    // Helper: remove duplicates based on phone
    const removeDuplicatesByPhone = (data) => {
      const seen = new Set();
      return data.filter(item => {
        if (!item.phone) return false;
        if (seen.has(item.phone)) return false;
        seen.add(item.phone);
        return true;
      });
    };

    const uniqueData = removeDuplicatesByPhone(parsedData);

    // Attach uploader (agent or admin)
    const uploaderId = req.user?.id;

    const listItemsWithUploader = uniqueData.map(item => ({
      ...item,
      assignedBy: uploaderId
    }));

    const createdItems = await SubListitem.insertMany(listItemsWithUploader);

    res.status(201).json({ message: 'List uploaded successfully', count: createdItems.length });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


// Distribute list items equally among agents
export const distributeLists = async (req, res) => {
  try {
    const agents = await SubAgent.find();
    if (agents.length < 1) return res.status(400).json({ message: 'No agents found' });

    const items = await SubListitem.find({ assignedTo: { $exists: false } });
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

    await SubListitem.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Distributed', total: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Distribution failed', error: err.message });
  }
};

// Get all list items assigned to a specific agent
export const getAgentList = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const data = await SubListitem.find({ assignedTo: agentId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};



export const distributeToSubagents = async (req, res) => {
  try {
    const agentId = req.user.id; // Logged-in agent's ID

    // Get all subagents created by this agent
    const subagents = await SubAgent.find({ createdBy: agentId });

    if (subagents.length === 0) {
      return res.status(400).json({ message: 'No subagents found' });
    }

    // Get unassigned items uploaded by this agent
    const items = await SubListitem.find({ assignedBy: agentId, assignedTo: { $exists: false } });

    if (items.length === 0) {
      return res.status(200).json({ message: 'No unassigned items to distribute' });
    }

    // Distribute in round-robin
    let assigned = [];
    for (let i = 0; i < items.length; i++) {
      const sub = subagents[i % subagents.length];
      items[i].assignedTo = sub._id;
      assigned.push(items[i]);
    }

    const bulkOps = assigned.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { assignedTo: item.assignedTo } }
      }
    }));

    await SubListitem.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Distributed to subagents', total: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Subagent distribution failed', error: err.message });
  }
};

// Delete a list item by ID
export const deleteListItem = async (req, res) => {
  try {
    const { agentId } = req.params;

    const deleted = await SubListitem.findByIdAndDelete(agentId);

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
}