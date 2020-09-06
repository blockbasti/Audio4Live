import axios from 'axios';
import { addHours, addMinutes, format, isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({
  origin: true,
});

const db = admin.firestore();

export const submit = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') return res.status(403);

    const date = {
      start: utcToZonedTime(req.body.date.start, 'Europe/Berlin'),
      end: utcToZonedTime(req.body.date.end, 'Europe/Berlin'),
    };
    const times = req.body.times;

    if (times && times.start !== '') {
      date.start = addHours(date.start, Number.parseInt(times.start.split(':')[0], 10));
      date.start = addMinutes(date.start, Number.parseInt(times.start.split(':')[1], 10));
    }

    if (times && times.end !== '') {
      date.end = addHours(date.end, Number.parseInt(times.end.split(':')[0], 10));
      date.end = addMinutes(date.end, Number.parseInt(times.end.split(':')[1], 10));
    }

    /* Format date and time for mail */
    let datestring = '';
    if (!date) datestring = 'kein Datum angegeben';
    else if (isSameDay(date.start, date.end)) {
      datestring = format(new Date(date.start), 'dd.MM.yyyy');
      if (times && (times.start !== '' || times.end !== '')) {
        datestring += ' (';
        if (times.start !== '' && times.end !== '') datestring += times.start + ' bis ' + times.end;
        else if (times.start !== '') datestring += times.start;
        else if (times.end !== '') datestring += 'bis ' + times.end;
        datestring += ')';
      }
    } else {
      if (times && (times.start !== '' || times.end !== '')) {
        if (times.start !== '') datestring = format(new Date(date.start), 'dd.MM.yyyy') + ' (' + times.start + ') - ';
        else datestring = format(new Date(date.start), 'dd.MM.yyyy') + ' - ';

        if (times.end !== '') datestring += format(new Date(date.end), 'dd.MM.yyyy') + ' (' + times.end + ')';
        else datestring += format(new Date(date.end), 'dd.MM.yyyy');
      } else {
        datestring = format(new Date(date.start), 'dd.MM.yyyy') + ' - ' + format(new Date(date.end), 'dd.MM.yyyy');
      }
    }

    /* Email to customer */
    db.collection('mail').add({
      to: req.body.email,
      template: {
        name: 'booking',
        data: {
          name: req.body.name,
          date: datestring,
          phone: req.body.phone,
          email: req.body.email,
          callback: req.body.phone !== '' ? (req.body.call ? '(Rückruf gewünscht)' : '(kein Rückruf)') : '',
          location: req.body.location !== '' ? req.body.location : 'kein Ort angegeben',
          message: req.body.message,
        },
      },
    });

    /* Add to booking DB */
    db.collection('booking').add({
      date: {
        start: new Date(date.start),
        end: new Date(date.end),
      },
      name: req.body.name,
      email: req.body.email,
      location: req.body.location,
      phone: req.body.phone,
      message: req.body.message,
    });

    return res.sendStatus(200);
  });
});

export const verify = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const data = {
      secret: functions.config().recaptcha.key,
      response: req.query['response'],
      remoteip: req.ip,
    };

    axios
      .post('https://www.google.com/recaptcha/api/siteverify?secret=' + data.secret + '&response=' + data.response + '&remoteip=' + data.remoteip)
      .then((resp) => {
        if (resp.data.success === true) res.sendStatus(200);
        else res.sendStatus(400);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });
});
