const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  // Link to the event this source belongs to
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true,
  },
  // Link to the user who added this source
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The type of source, allowing for future expansion
  type: {
    type: String,
    enum: ['url', 'text', 'pdf'],
    default: 'url',
    required: true,
  },
  // A display title for the source (e.g., the article title or filename)
  title: {
    type: String,
    required: [true, 'A title for the source is required.'],
    trim: true,
  },
  // The actual content: a URL for a link, the full text for pasted content,
  // or the permanent URL from Firebase Storage for a PDF.
  content: {
    type: String,
    required: true,
  },
  // The status of the source, to be used by the Python AI service for processing
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Source', sourceSchema);
