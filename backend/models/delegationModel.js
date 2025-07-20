const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const delegationSchema = new mongoose.Schema({
    userId : {type:mongoose.Schema.Types.ObjectId,ref:'User',require: true,index:true},
    eventId: {type:mongoose.Schema.Types.ObjectId,ref:'Event',require:true,index:true},
    country: {type: String,required: true}
},{ timestamps: true });
delegationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Delegation', delegationSchema);