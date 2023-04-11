const fs = require("fs");
const getResets = require("./getReset");
const path = require("path");
const resetPath = path.join(path.resolve('./'), '/textDB/reset.json');

const tryReset = (token) => {
    return new Promise((resolve, reject) => {
        try {
            setReset(token);
            resolve("Success");
        } catch (e) {
            reject(e);
        };
    });
};

const setReset = (token) => {
    const resetObj = getResets();

    if (resetObj.includes(token)) {
        throw new Error("Password reset already registered");
    }

    resetObj.push(token);
    fs.writeFileSync(resetPath, JSON.stringify(resetObj));
};

module.exports = tryReset;