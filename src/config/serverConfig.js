const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    EMAIL_ID : process.env.EMAIL_ID,
    APP_PASSWORD : process.env.APP_PASSWORD,
    MESSAGE_BROKER_URL : process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY : process.env.REMINDER_BINDING_KEY,
    QUEUE_NAME : process.env.QUEUE_NAME
}
