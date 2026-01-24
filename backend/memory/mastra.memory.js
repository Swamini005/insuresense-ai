import mongoose from 'mongoose';

const agentMemorySchema = new mongoose.Schema({
    agentName: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    context: { type: String }
}, { timestamps: true });

agentMemorySchema.index({ agentName: 1, key: 1 });

export const AgentMemory = mongoose.model('AgentMemory', agentMemorySchema);
