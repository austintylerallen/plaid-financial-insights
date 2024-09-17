const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes'); // Import plaid routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware'); // Import token verification middleware
const protectedRoutes = require('./routes/protectedRoutes'); // Import additional protected routes

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: '*',  // You may want to restrict this to specific origins in production
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

// Public routes (authentication)
app.use('/api/auth', authRoutes);

// Protected routes (requires token for access)
app.use('/api/plaid', verifyToken, plaidRoutes); // Plaid routes protected with token verification middleware

// Use additional protected routes (requires token for access)
app.use('/api', verifyToken, protectedRoutes); // Assuming protectedRoutes also need token verification

// Change default port to 5005
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
