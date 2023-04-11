const fs = require('fs');
const path = require('path');
const resetPath = path.join(path.resolve('./'), '/textDB/reset.json');

const getResets = () => {
    const reset = fs.readFileSync(resetPath, "utf8");
    return JSON.parse(reset);
};

module.exports = getResets;