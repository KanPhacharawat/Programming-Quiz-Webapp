// indexController.js
const User = require('../models/User'); // Make sure the path to your User model is correct

module.exports = async (req, res) => {
  try {
    // Move this line inside the asynchronous route handler
    const name = global.name;

    const topUsers = await User.find({})
      .sort({ score: -1 }) 
      .limit(10);
    
    res.render('rank.ejs', { team: topUsers, name });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).send('Internal Server Error');
  }
};
