const express = require('express');
const bodyParser = require('body-parser');
const setUser = require('./textDB/setUser');
const validateUser = require('./middlewares/validateUser');
const port = process.env.PORT || 8080;

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/signin', (req, res) => {
    res.render('pages/signIn');
});

app.post('/', (req, res) => {
    const { username, email, password, repeat_pass } = req.body;

    if (!username || !email || !password || !repeat_pass) {
        res.render('pages/error', { message: 'Please fill all fields' });
        return;
    }

    if (password !== repeat_pass) {
        res.render('pages/error', { message: 'Passwords do not match' });
        return;
    }

    try {
        setUser(username, email, password);
    } catch (err) {
        res.render('pages/error', { message: err.message });
        return;
    }

    res.render('pages/success', {
        message: `User with name ${username} and email ${email} generated`,
        label: "Sign in",
        link: "/signin"
    });

});

app.post('/signin', validateUser, (req, res) => {
    res.render('pages/success', {
        message: `Welcome ${res.locals.user.username}`,
        label: "Go to home",
        link: "/"
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});