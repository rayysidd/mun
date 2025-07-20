const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const eventSchema = new mongoose.Schema({
    
    // The user who created the event
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventName:{
        type:String,
        required:true,
        trim:true
    },
    committee:{
        type:String,
        required:true,
    },
    agenda: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: [true, 'A passcode is required to create an event'],
        select: false
    }
},{ timestamps: true });
// Middleware to hash the passcode before saving a new event
eventSchema.pre('save', async function(next) {
    if (!this.isModified('passcode')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passcode = await bcrypt.hash(this.passcode, salt);
    next();
});
module.exports = mongoose.model('Event', eventSchema);