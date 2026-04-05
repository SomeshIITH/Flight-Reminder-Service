const nodemailer = require('nodemailer');

const {EMAIL_ID,APP_PASSWORD} = require('./serverConfig');

const transport = nodemailer.createTransport({
    service : 'Gmail',
    auth : {
        user : EMAIL_ID,
        pass : APP_PASSWORD
    }
})

module.exports = {
    transport
}