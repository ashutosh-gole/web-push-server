require('dotenv').config();

const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const subscription = {
    "endpoint": "",
    "expirationTime": null,
    "keys": {
        "p256dh": "",
        "auth": ""
    }
}

webPush.setVapidDetails('your mail', publicVapidKey, privateVapidKey);

app.post('/send-notification', (req, res) => {

    const notificationPayload = {
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "vibrate": [100, 50, 100],
            "data": {
                "url": "https://www.youtube.com/watch?v=0vSEmEdYKro&list=PL4cSPhAvl8xUHh6ojmhFDGdMQmJWFcxrc&index=4",
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    };

    webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
        .then(result => {
            if (result) {
                res.status(200).send("Successfully Sent Notification");
            }
        })
        .catch(error => console.error(error));
});

const port = parseInt(process.env.PORT, 10) || 3000;
app.set("port", port);

const server = app.listen(port, () => {
    console.log(`Node app is running at ${port} port`);
});