const logger = require('./logger');
const config = require('/app/config/config');
const torrentsAPI = require('./torrents');
const fs = require('fs');
const path = require('path');

const verify = () => {
    if (config.username === 'username' || config.password === 'password') {
        logger.warn('Seems like you are using the default credentials, might not work');
    }
    const cors = process.env.CORS_WHITELIST || config.cors;
    logger.info('Using CORS: ' + cors);
    let defaultLocation;
    try {
        defaultLocation = torrentsAPI.getDownloadLocation('', '', '');
    } catch (e) {
        logger.error('Could not get default location, if using a function, make sure it returns a default string in case no match');
        return false;
    }
    logger.info('Verifying default location for writing: ' + defaultLocation);
    const testpath = path.join(defaultLocation, '__test');
    try {
        fs.writeFileSync(testpath, 'testing');
        fs.unlinkSync(testpath);
    } catch (e) {
        logger.error('Could not write at the default location ' + defaultLocation);
        return false;
    }
    logger.info('Successfully tested default location ' + defaultLocation);
    return true;
}

module.exports = verify;