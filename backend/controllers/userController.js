const User = require('../models/userModel');
const Speech=require('../models/speechModel');
const Event=require('../models/eventModel');
const Source = require('../models/sourceModel');
const Delegation=require('../models/delegationModel');
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


const saveSpeech = async (req, res) => {
  try {
    const { content, topic, country, eventId } = req.body;
    const userId = req.user.id;

    if (!content || !topic || !country || !eventId) {
      return res.status(400).json({ error: 'Content, topic, country, and eventId are required.' });
    }

    // Authorization: Check if the user is a delegate in the specified event
    const isParticipant = await Delegation.findOne({ eventId, userId });
    if (!isParticipant) {
      return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
    }

    // Step 1: Create the Speech document (as before)
    const speech = await Speech.create({ content, topic, country, eventId, userId });

    // Step 2: NEW - Also create a Source document from the speech
    await Source.create({
      eventId,
      userId,
      title: `Saved Speech: "${topic}"`, // Auto-generate a title
      content: content,
      type: 'text', // Saved speeches are treated as text sources
      status: 'pending' // The ingestion service will process it
    });

    res.status(201).json(speech);
  } catch (err) {
    console.error('Save Speech Error:', err);
    res.status(500).json({ error: 'Could not save speech' });
  }
};

const deleteSpeech = async (req, res) => {
    try {
        const speech = await Speech.findById(req.params.speechId);

        if (!speech) {
            return res.status(404).json({ error: 'Speech not found' });
        }

        // Security check: Ensure the speech belongs to the user trying to delete it
        if (speech.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: 'User not authorized' });
        }

        await Speech.findByIdAndDelete(req.params.speechId);
        res.status(200).json({ id: req.params.speechId, message: 'Speech deleted successfully' });
    } catch (err) {
        console.error('Error deleting speech:', err);
        res.status(500).json({ error: 'Server error while deleting speech.' });
    }
};


const getSpeech = async(req,res)=>{
  try{
    const userId=req.user.id;
    const { eventId } = req.query;

    let query = { userId }; // Base query always filters by the logged-in user

    if (eventId) {
      // If an eventId is provided, add it to the query
      query.eventId = eventId;

      // Authorization check: Ensure user is part of the event they are querying for
      const isParticipant = await Delegation.findOne({ eventId, userId });
      if (!isParticipant) {
        return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
      }
    }
    const speeches = await Speech.find(query).sort({createdAt:-1});

    if (!speeches) {
      return res.status(404).json({ error: 'No speeches found for this user.' });
    }

    res.status(200).json(speeches);
  }catch (err) {
    console.error('Error fetching user speeches:', err);
    res.status(500).json({ error: 'Server error while fetching speeches.' });
  }
};
module.exports = { registerUser, loginUser,saveSpeech ,getSpeech,deleteSpeech};
