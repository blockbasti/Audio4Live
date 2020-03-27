import * as functions from 'firebase-functions';

import { format } from 'date-fns';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({
    origin: true,
});

const db = admin.firestore();

export const submit = functions.https.onRequest((req, res) => {
    
    cors(req,res, () => {
        if(req.method !== 'POST') return res.status(403);
        
        /* Email to customer */
        db.collection('mail').add({
            to: req.body.email,
            template: {
                name: 'booking',
                data: {
                    date: {
                        start: format(new Date(req.body.date.start),'dd.MM.yyyy HH:mm'),
                        end: format(new Date(req.body.date.end),'dd.MM.yyyy HH:mm')
                    },
                    location: req.body.location,
                    message: req.body.message
                }
            }
        });

        /* Add to booking DB */
        db.collection('booking').add({
            date: {
                start: new Date(req.body.date.start),
                end: new Date(req.body.date.end)
            },
            email: req.body.email,
            location: req.body.location,
            phone: req.body.phone,
            message: req.body.message
        });

        return res.sendStatus(200);
    })
});