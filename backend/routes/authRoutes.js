const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');


dotenv.config();  // Load environment variables

const router = express.Router();

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function getUserCollection() {
  await client.connect();
  return client.db('test').collection('users');
}

// JWT Secret from env
const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const users = await getUserCollection();

  // Check if the user already exists
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    email,
    password: hashedPassword
  };

  await users.insertOne(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const users = await getUserCollection();

  // Find the user
  const user = await users.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

  res.json({ token, user: { id: user._id, email: user.email } });
});

// Protected Route Example
router.get('/me', (req, res) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
  
    // Check if token is missing
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Return user info from the decoded token
      res.json({ userId: decoded.userId, email: decoded.email });
    } catch (error) {
      console.error('Error verifying token:', error.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  });
  
module.exports = router;
