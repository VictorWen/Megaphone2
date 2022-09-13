const fs = require('fs');
const config = require('../config.json');

module.exports = {
    userAudioWriteStream(guildId, userId) {
        const guildFolder = `${config.data_folder}/${guildId}`;
        const userFile = `${guildFolder}/${userId}.ogg`;

        if (!fs.existsSync(guildFolder))
            fs.mkdirSync(guildFolder);

        return fs.createWriteStream(userFile);
    },
    userAudioReadStream(guildId, userId) {
        const guildFolder = `${config.data_folder}/${guildId}`;
        const userFile = `${guildFolder}/${userId}.ogg`;

        if (!fs.existsSync(userFile))
            return fs.createReadStream(`${config.data_folder}/default.ogg`);
        
        return fs.createReadStream(userFile);
    },
    getUserData(guildId, userId) {
        const guildFolder = `${config.data_folder}/${guildId}`;
        const userFile = `${guildFolder}/${userId}.json`;

        if (!fs.existsSync(userFile))
            return JSON.parse(fs.readFileSync(`${config.data_folder}/default.json`))

        const data = JSON.parse(fs.readFileSync(userFile));
        return data;
    },
    setUserData(guildId, userId, data) {
        const guildFolder = `${config.data_folder}/${guildId}`;
        const userFile = `${guildFolder}/${userId}.json`;

        if (!fs.existsSync(guildFolder))
            fs.mkdirSync(guildFolder);

        fs.writeFileSync(userFile, JSON.stringify(data));
    }
}