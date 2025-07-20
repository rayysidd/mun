const EventModel = require('../models/eventModel');
const Delegation = require('../models/delegationModel'); 
const Source = require('../models/sourceModel');
const bcrypt = require('bcryptjs');

/**
 * @desc    Create a new MUN event
 * @route   POST /api/events
 * @access  Private
 */
const createEvent = async (req, res) => {
  const { eventName, committee, agenda, passcode, country } = req.body;
  const userId = req.user.id;

  if (!eventName || !committee || !agenda || !passcode || !country) {
    return res.status(400).json({ error: 'All fields are required to create an event.' });
  }

  try {
    const existingEvent = await EventModel.findOne({ eventName });
    if (existingEvent) {
      return res.status(409).json({ error: 'An event with this name already exists. Please choose another name.' });
    }

    const newEvent = await EventModel.create({
      eventName,
      committee,
      agenda,
      passcode,
      host: userId,
    });

    const newDelegation = await Delegation.create({
      eventId: newEvent._id,
      userId,
      country,
    });

    res.status(201).json({
      message: 'Event created successfully.',
      event: newEvent,
      delegation: newDelegation,
    });

  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ error: 'Server error during event creation.' });
  }
};

/**
 * @desc    Join an existing MUN event
 * @route   POST /api/events/join
 * @access  Private
 */
const joinEvent = async (req, res) => {
  const { eventName, passcode, country } = req.body;
  const userId = req.user.id;

  if (!eventName || !passcode || !country) {
    return res.status(400).json({ error: 'Event name, passcode, and country are required.' });
  }

  try {
    const event = await EventModel.findOne({ eventName }).select('+passcode');
    
    if (!event) {
      return res.status(404).json({ error: 'An event with this name was not found.' });
    }

    const isMatch = await bcrypt.compare(passcode, event.passcode);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect passcode for this event.' });
    }

    const existingDelegation = await Delegation.findOne({ eventId: event._id, userId });
    if (existingDelegation) {
      return res.status(409).json({ error: 'You have already joined this event.' });
    }

    const newDelegation = await Delegation.create({
      eventId: event._id,
      userId: userId,
      country: country,
    });

    res.status(200).json({
      message: 'Successfully joined event.',
      delegation: newDelegation,
    });

  } catch (err) {
    console.error('Join Event Error:', err);
    res.status(500).json({ error: 'Server error while joining event.' });
  }
};

/**
 * @desc    Get all events the current user is a part of
 * @route   GET /api/events
 * @access  Private
 */
const getEvents = async (req, res) => {
  try {
    const delegations = await Delegation.find({ userId: req.user.id })
      .populate('eventId')
      .sort({ createdAt: -1 });
    
    const validDelegations = delegations.filter(d => d.eventId);

    res.status(200).json(validDelegations);
  } catch (err) {
    console.error('Get My Events Error:', err);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

/**
 * @desc    Get details for a single event
 * @route   GET /api/events/:eventId
 * @access  Private
 */
/**
 * @desc    Get details for a single event, including its delegates
 * @route   GET /api/events/:eventId
 * @access  Private
 */
const getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const requestingUserId = req.user.id;

    // Step 1: Check if the user is authorized to view this event
    const isUserParticipant = await Delegation.findOne({ eventId, userId: requestingUserId });
    if (!isUserParticipant) {
      return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
    }

    // Step 2: If authorized, fetch the main event details
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Step 3 (THE FIX): Fetch all delegates for that event and populate their usernames
    const delegates = await Delegation.find({ eventId }).populate('userId', 'username');

    // Step 4 (THE FIX): Return a combined object with both event and delegates
    res.status(200).json({ event, delegates });

  } catch (err) {
    console.error('Get Single Event Error:', err);
    res.status(500).json({ error: 'Server error while fetching event details.' });
  }
};
/**
 * @desc    Get all delegates for a specific event
 * @route   GET /api/events/:eventId/delegates
 * @access  Private
 */
const getDelegates = async (req, res) => {
    try {
        const { eventId } = req.params;
        const requestingUserId = req.user.id;

        const isUserParticipant = await Delegation.findOne({ eventId, userId: requestingUserId });
        if (!isUserParticipant) {
            return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
        }

        const delegates = await Delegation.find({ eventId }).populate('userId', 'username');

        res.status(200).json(delegates);
    } catch (err) {
        console.error('Get Event Delegates Error:', err);
        res.status(500).json({ error: 'Server error while fetching delegates.' });
    }
};

/**
 * @desc    Leave an event (deletes a user's delegation)
 * @route   DELETE /api/events/:eventId/leave
 * @access  Private
 */
const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const delegation = await Delegation.findOneAndDelete({ eventId, userId });

    if (!delegation) {
      return res.status(404).json({ error: "You were not a participant in this event." });
    }

    res.status(200).json({ message: "You have successfully left the event." });

  } catch (err) {
    console.error('Leave Event Error:', err);
    res.status(500).json({ error: 'Server error while leaving event.' });
  }
};


/**
 * @desc    Add a new text/URL source to an event
 * @route   POST /api/events/:eventId/sources
 * @access  Private
 */
const addSource=async(req,res) =>{
  try{
    const{eventId}=req.params;
    const{title,content,type}=req.body;
    const userId=req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Source title and content are required.' });
    }

    const isParticipant = await Delegation.findOne({ eventId, userId });
    if (!isParticipant) {
      return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
    }

    const newSource = await Source.create({
      eventId,
      userId,
      title,
      content,
      type: type || 'text', // Default to 'text' if not provided
    });

    res.status(201).json(newSource);

  }
   catch (err) {
    console.error('Add Source Error:', err);
    res.status(500).json({ error: 'Server error while adding source.' });
  }
}

/**
 * @desc    Get all knowledge sources for an event
 * @route   GET /api/events/:eventId/sources
 * @access  Private
 */
const getSources = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const isParticipant = await Delegation.findOne({ eventId, userId });
    if (!isParticipant) {
      return res.status(403).json({ error: 'Forbidden: You are not a participant in this event.' });
    }

    const sources = await Source.find({ eventId }).sort({ createdAt: -1 });
    res.status(200).json(sources);

  } catch (err) {
    console.error('Get Sources Error:', err);
    res.status(500).json({ error: 'Server error while fetching sources.' });
  }
};
module.exports = {createEvent,joinEvent,getEvents,getDelegates,leaveEvent,getSingleEvent,addSource,getSources};
