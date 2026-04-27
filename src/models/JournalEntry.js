// src/models/JournalEntry.js
import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const JournalEntry = mongoose.models?.JournalEntry || mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;