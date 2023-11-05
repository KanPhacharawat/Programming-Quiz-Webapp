const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizList = new Schema({
    Title: {
        type: String
    },
    Input: {
        type: String
    },
    Output: {
        type : String
    },
    Question: {
        type: String
    },
    InputTest: {
        type: String
    },
    OutputTest: {
        type: String
    }
});

const Quiz = mongoose.model('problems', QuizList);
module.exports = Quiz;
