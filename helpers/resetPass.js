const fs = require("fs");
const getResets = require("./getReset");
const path = require("path");
const { getUsers } = require("../textDB/getUser");
const usersPath = path.join(path.resolve('./'), '/textDB/users.json');
const resetPath = path.join(path.resolve('./'), '/textDB/reset.json');

const decodeToken = token => Buffer.from(token, "base64").toString("ascii");

const resetPass = (token, password) => {

    if (!getResets().includes(token)) throw new Error("Invalid token");

    const userEmail = decodeToken(token);

    const users = getUsers();
    const newUsers = users.map(user => {
        if (user.email === userEmail) {
            user.password = password;
        }
        return user;
    });

    fs.writeFileSync(usersPath, JSON.stringify(newUsers));

    const resetObj = getResets();
    const newResetObj = resetObj.filter(reset => reset !== token);

    fs.writeFileSync(resetPath, JSON.stringify(newResetObj));
};

module.exports = resetPass;