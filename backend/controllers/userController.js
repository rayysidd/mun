const User = require('../models/userModel');
const Speech=require('../models/speechModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Register Error:", error.message, error.stack);
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const saveSpeech = async(req,res)=>{
  try{
    const{content,topic,country} = req.body;
    // NEW: Add validation for the new fields
    if (!content || !topic || !country) {
      return res.status(400).json({ error: 'Content, topic, and country are required.' });
    }
    const speech = await Speech.create({ content,topic,country, userId: req.user.id });
    res.status(201).json(speech);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Could not save speech' });
  }
};

const getSpeech = async(req,res)=>{
  try{
    const speeches = await Speech.find({userId:req.user.id}).sort({createdAt:-1});

    if (!speeches) {
      return res.status(404).json({ error: 'No speeches found for this user.' });
    }

    res.status(200).json(speeches);
  }catch (err) {
    console.error('Error fetching user speeches:', err);
    res.status(500).json({ error: 'Server error while fetching speeches.' });
  }
};
module.exports = { registerUser, loginUser,saveSpeech ,getSpeech};
