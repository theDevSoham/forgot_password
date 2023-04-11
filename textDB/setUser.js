const fs = require('fs');
const path = require('path');
const { getUsers } = require('./getUser');

const dbPath = path.join(__dirname, 'users.json');

const setUser = (username, email, password) => {
    const users = getUsers();

    const user = users.find(user => user.email === email);
    if (user) {
        throw new Error('User already exists');
    };

    const _id = Date.now() + `_${users.length}`;
    const newUser = { _id, username, email, password };
    users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(users));
};

module.exports = setUser;