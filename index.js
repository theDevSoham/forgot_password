const express = require('express');
const bodyParser = require('body-parser');
const setUser = require('./textDB/setUser');
const { validateUser, validateWithoutPassword } = require('./middlewares/validateUser');
const { sendMail, makeToken } = require('./helpers/email');
const tryReset = require('./helpers/setReset');
const resetPass = require('./helpers/resetPass');
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

app.get('/forget', (req, res) => {
    res.render('pages/forget');
});

app.get('/reset', (req, res) => {
    const token = req.params.token;

    res.render('pages/reset', { token });
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

app.post('/forget', validateWithoutPassword, (req, res) => {

    const token = makeToken(res.locals.user.email);

    const link = `http://localhost:8080/reset?token=${token}`;

    try {
        tryReset(token).then(msg => {
            sendMail(req.body.email, "Reset password", `Reset Password link: ${link}`);
            res.render('pages/success', {
                message: `A confirmation link is sent to ${req.body.email}`,
                label: "Go to home",
                link: "/"
            });
        }).catch(err => {
            res.render('pages/error', { message: err.message });
        });
    } catch (error) {
        res.render("pages/error", { message: error.message });
        return;
    }
});

app.post('/reset', (req, res) => {
    const { token, password, repeat_pass } = req.body;

    if (!password || !repeat_pass) {
        res.render('pages/error', { message: 'Please fill all fields' });
        return;
    }

    if (password !== repeat_pass) {
        res.render('pages/error', { message: 'Passwords do not match' });
        return;
    }

    try {
        resetPass(token, password);
        res.render('pages/success', {
            message: `Password changed successfully`,
            label: "Go to home",
            link: "/"
        });

    } catch (error) {
        res.render('pages/error', { message: error.message });
        return;
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});