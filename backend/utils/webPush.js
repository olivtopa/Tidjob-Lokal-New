const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('VAPID keys are missing! Notifications will not work.');
}

webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@tidjob.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = webPush;
