const SLACK_BOT_TOKEN = process.env.NODE_ENV === 'development' ? process.env.SLACK_BOT_TOKEN_DEV : process.env.SLACK_BOT_TOKEN_PROD
const SLACK_SIGNING_SECRET = process.env.NODE_ENV === 'development' ? process.env.SLACK_SIGNING_SECRET_DEV : process.env.SLACK_SIGNING_SECRET_PROD
const SLACK_APP_TOKEN = process.env.NODE_ENV === 'development' ? process.env.SLACK_APP_TOKEN_DEV : process.env.SLACK_APP_TOKEN_PROD

module.exports = {SLACK_APP_TOKEN, SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN}