const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const wardrobeRoutes = require('./routes/wardrobe.routes');
const clothingRoutes = require('./routes/clothing.routes');
const typeRoutes = require('./routes/type.routes');
const subtypeRoutes = require('./routes/subtype.routes');
const characteristicRoutes = require('./routes/characteristic.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/wardrobes', wardrobeRoutes);
app.use('/api/clothes', clothingRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/subtypes', subtypeRoutes);
app.use('/api/characteristics', characteristicRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to InfoWash API - Clothing Care Management');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/infowash', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

module.exports = app;