
const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/gofood';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', async () => {
  console.log('Connected to MongoDB');

  try {
    const FoodItem = mongoose.model('FoodItem', new mongoose.Schema({}), 'FoodItem');
    const foodItems = await FoodItem.find({}).exec();

    global.fooditems = foodItems; // Make sure to use lowercase 'fooditems'
    console.log(global.fooditems);
    // Log the retrieved data
  } catch (err) {
    console.error('Error fetching data:', err);
  }
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

// Export a function that can be called to perform any required database setup.
module.exports = function(callback) {
  // You can call the callback function here if needed
  callback(); // Modify this to pass any relevant data
};
