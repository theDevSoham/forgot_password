const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'users.json');

const getUsers = () => {
    const users = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(users);
};

const getUser = (email) => {
    const users = getUsers();
    const user = users.find(user => user.email === email);
    if (typeof user == "undefined") return [];
    return user;
};

module.exports = {
    getUsers,
    getUser,
};