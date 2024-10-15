const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5000;
app.use(express.json());
var admin = require("firebase-admin");

// Environment Variables
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wizzybet-5021b-default-rtdb.firebaseio.com"
});
app.listen(port, () => {
    console.log(`Kawogo Admin server is listening on port ${port}!`)
})
// sending sample message
const topic = 'all';
app.post('/send-all', (req, res) => {
    const { title, body, url, id, type } = req.body;
    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            notification_foreground: "true",
            notification_id: id,
            notification_type: type,
        },
        android: {
            notification: {
                imageUrl: url
            }
        },
        topic: topic // send to all users
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            // Return success response to the frontend
            res.json({ success: true, messageId: response });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            // Return error response to the frontend
            res.status(500).json({ success: false, error: error.message });
        });
});

app.post('/send-custom', (req, res) => {
    const { title, body } = req.body;
    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            notification_foreground: "true",
        },
        topic: 'all' // send to all users
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            res.json({ success: true, messageId: response });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});