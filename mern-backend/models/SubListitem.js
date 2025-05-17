import mongoose from 'mongoose';

const SublistItemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  assignedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Agent' // or 'User' if admins also upload
},
});

export default mongoose.model('SubListItem', SublistItemSchema);
