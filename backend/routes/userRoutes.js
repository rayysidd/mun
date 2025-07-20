const express = require('express');
const { registerUser, loginUser, saveSpeech,getSpeech,deleteSpeech} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verify } = require('crypto');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',verifyToken,(req,res)=>{
    res.status(200).json({message:"Access Granted,user:req.user"})
});
router.post('/save',verifyToken,saveSpeech);
router.get('/test-token', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});
router.get('/speeches',verifyToken,getSpeech);
router.delete('/speeches/:id',verifyToken,deleteSpeech);
module.exports = router;