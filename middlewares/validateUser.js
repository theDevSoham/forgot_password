const { getUser } = require("../textDB/getUser");

const validateUser = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.render('pages/error', { message: 'Please fill all fields' });
        return;
    };

    const user = getUser(email);

    if (user.length === 0) {
        res.render('pages/error', { message: 'User does not exist' });
        return;
    }

    if (user.password !== password) {
        res.render('pages/error', { message: 'Wrong password' });
        return;
    }

    res.locals.user = user;

    next();
};

const validateWithoutPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        res.render('pages/error', { message: 'Please fill all fields' });
        return;
    };

    const user = getUser(email);

    if (user.length === 0) {
        res.render('pages/error', { message: 'User does not exist' });
        return;
    }

    res.locals.user = user;

    next();
};

module.exports = {
    validateUser,
    validateWithoutPassword
};