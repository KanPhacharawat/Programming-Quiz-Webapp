const Quiz = require('../models/Quiz')

module.exports = async (req, res) => {
  try {
    const data = await Quiz.find({});
    res.render("problem", { data: data });
  } catch (error) {
    console.log(error);
  }
};