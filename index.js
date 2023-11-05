const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ejs = require('ejs');
const User = require('./models/User'); // Import the User model
const Quiz = require('./models/Quiz');
const bcrypt = require('bcrypt');
const Swal = require('sweetalert2');
const multer = require('multer');
const fs = require('fs');
var compiler = require('compilex');
var options = {stats : true}; //prints stats on console 
compiler.init(options);

// Controllers
const indexController = require('./controllers/indexController');
const loginController = require('./controllers/loginController');
const redirectIfAuth = require('./middleware/redirectIfAuth');
const redirectIfNot = require('./middleware/redirectIfNot');
const problemController = require('./controllers/problemController');
const problemDetailsController = require('./controllers/problemDetailsController');
const alertController = require('./controllers/alertController');
const { type } = require('os');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.poahwqx.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


global.name = null;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.set('view engine', 'ejs');


app.use(session({
    secret: 'node secret',
}));

app.get('/', redirectIfNot)
app.get('/rank', redirectIfNot, indexController);
app.get('/login', redirectIfAuth, loginController);
app.get('/problem', redirectIfNot, problemController);
app.get('/problem-details', problemDetailsController);
app.get('/alert',alertController);

app.post('/submit', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });

        if (user) {
            req.session.userId = user._id;
            global.name = user.username;
            res.redirect('/rank');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submitans', upload.single('myfile'), async (req, res) => {
    try {
        const input = req.body.input;
        const output = req.body.output;
        const id = req.body.qid;
        const canSend = req.body.canSend;

        console.log(canSend)

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = req.file.originalname;

        const code = req.file.buffer.toString('utf-8');
        const envData = { OS: "windows", cmd: "g++", options: { timeout: 1000 } };

        compiler.compileCPPWithInput(envData, code, input, async function (data) {
            if (data.error) {
                return res.send(data.error);
            }

            if (data.output == output && canSend) {
                const userData = await User.findOne({ username: global.name });

                console.log("In");

                if (userData) {
                    userData.score += 100;
                    userData.attempt ++;
                    
                    if(userData.finished.length <=1 && userData.finished[0] == "") {
                        userData.finished[0] = id;
                    }
                    else {
                        userData.finished.push(id);
                    }
                    userData.save();

                    const type = true;
                    res.render('score.ejs', {type});
                } else {
                    return res.status(404).send('User not found');
                }
            }
            else{
                const type = false;
                res.render('score.ejs', {type});
            }

            compiler.flush(function () {
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});