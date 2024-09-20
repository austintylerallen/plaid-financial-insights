const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const plaidRoutes = require('./routes/plaidRoutes'); // Plaid routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const verifyToken = require('./middleware/authMiddleware'); // Token verification middleware
const protectedRoutes = require('./routes/protectedRoutes'); // Additional protected routes
const insightsRoutes = require('./routes/insightsRoutes'); // Insights routes
const budgetRoutes = require('./routes/budgetRoutes'); // Budget routes
const summaryRoutes = require('./routes/summaryRoutes'); // Monthly summary routes
const suggestionRoutes = require('./routes/suggestionRoutes'); // Suggestions routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: '*',  // Adjust this in production to only allow specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'X-Auth-Token', 'Content-Type'],
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
app.use('/api/plaid', verifyToken, plaidRoutes); // Plaid routes
app.use('/api/insights', verifyToken, insightsRoutes); // Insights routes
app.use('/api/budget', verifyToken, budgetRoutes); // Budget routes
app.use('/api/summary', verifyToken, summaryRoutes); // Monthly summary routes
app.use('/api/suggestions', verifyToken, suggestionRoutes); // Suggestions routes

// Additional protected routes
app.use('/api/protected', verifyToken, protectedRoutes); // Adjust the path if needed

// Serve frontend build files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Catch-all route to serve frontend's index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Change default port to 5005
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
