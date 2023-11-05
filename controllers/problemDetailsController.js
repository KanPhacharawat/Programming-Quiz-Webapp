const Quiz = require('../models/Quiz');
const User = require('../models/User');

module.exports = async (req, res) => {
    const quizItemId = req.query.quizItemId;
    
    try {
        const problem = await Quiz.findById(quizItemId);
        const user = await User.findOne({username : global.name});
        const isFinish = user.finished.includes(quizItemId);
        
        if (problem) {
            console.log(isFinish);
            res.render('submit', { problem, quizItemId, isFinish});
        } else {
            res.status(404).send('Problem not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};