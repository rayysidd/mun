const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mun-assistant')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/',(req,res)=>{
  res.send("Backend is running!")
});
// // Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/users', userRoutes);
// app.use('/api/users', require('./routes/userRoutes'));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 