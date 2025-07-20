const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const {createEvent,joinEvent,getEvents,getDelegates,leaveEvent,getSingleEvent,addSource,getSources} = require('../controllers/eventController')
const router = express.Router();

//file handling library
const multer = require('multer')
// Configure multer for in-memory storage. It will hold the file temporarily before we upload it to Firebase.
const upload = multer({ storage: multer.memoryStorage() });


//create/join events
router.post('/', verifyToken,createEvent);
router.post('/join',verifyToken,joinEvent);

//get events
router.get('/',verifyToken,getEvents);
router.get('/:eventId',verifyToken,getSingleEvent);

//get delegates
router.get('/:eventId/delegates',verifyToken,getDelegates);

//sources for rag
router.post('/:eventId/sources',verifyToken,addSource);
router.get('/:eventId/sources',verifyToken,getSources);
// router.post('/:eventId/upload',verifyToken,uploadPdf); will do later

//delete event
router.delete('/:eventId/leave',verifyToken,upload.single('file'),leaveEvent);
module.exports = router;