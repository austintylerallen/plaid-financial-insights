const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Use Plaid routes
app.use('/api/plaid', plaidRoutes);

// Change default port to 5005
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
