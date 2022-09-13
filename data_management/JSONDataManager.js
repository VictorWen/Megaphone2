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

        let data = JSON.parse(fs.readFileSync(`${config.data_folder}/default.json`));
        if (fs.existsSync(userFile))
            data = {...data, ...JSON.parse(fs.readFileSync(userFile))};
        
        return data;
    },
    setUserData(guildId, userId, data) {
        const guildFolder = `${config.data_folder}/${guildId}`;
        const userFile = `${guildFolder}/${userId}.json`;

        userData = this.getUserData(guildId, userId);
        data = {...userData, ...data};

        if (!fs.existsSync(guildFolder))
            fs.mkdirSync(guildFolder);

        fs.writeFileSync(userFile, JSON.stringify(data, null, 4));
    }
}