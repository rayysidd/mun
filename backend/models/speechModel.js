const mongoose = require('mongoose');

const speechSchema = new mongoose.Schema({
    userId : {type:mongoose.Schema.Types.ObjectId,ref:'User',require: true,index:true},
    topic: { type: String, required: true },
    country: { type: String, required: true },
    content:{type: String,required:true},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Speech', speechSchema);