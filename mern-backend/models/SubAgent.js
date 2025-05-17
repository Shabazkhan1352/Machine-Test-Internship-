import mongoose from 'mongoose';

const subagentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
 
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Agent',
  default: null, // Admin-created agents will have null
},


});

export default mongoose.model('SubAgent', subagentSchema);
