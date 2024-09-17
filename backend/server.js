const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware'); // Import token verification middleware
const protectedRoutes = require('./routes/protectedRoutes'); // Import the new route



// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',  // Or restrict to specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'X-Auth-Token', 'Content-Type'],  // Allow custom headers
}));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Public routes
app.use('/api/auth', authRoutes);
// Protected routes (requires token)
app.use('/api/plaid', verifyToken, plaidRoutes); // Use middleware for protected routes
// Use the protected routes
app.use('/api', protectedRoutes);

// Change default port to 5005
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
