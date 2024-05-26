import axios from 'axios';
import { addHours, addMinutes, format, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import * as functions from 'firebase-functions';
import { Buchung } from '../../src/app/buchen/buchung';

import admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const submit = functions.https.onCall(async (data: Buchung) => {
  const date = data.date
    ? {
        start: toZonedTime(data.date.start, 'Europe/Berlin'),
        end: toZonedTime(data.date.end, 'Europe/Berlin')
      }
    : undefined;
  const times = data.times;

  if (date && times && times.start !== '') {
    date.start = addHours(date.start, Number.parseInt(times.start.split(':')[0], 10));
    date.start = addMinutes(date.start, Number.parseInt(times.start.split(':')[1], 10));
  }

  if (date && times && times.end !== '') {
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
  await db.collection('mail').add({
    to: data.email,
    bcc: 'info@audio4live.de',
    template: {
      name: 'booking',
      data: {
        name: data.name,
        date: datestring,
        phone: data.phone,
        email: data.email,
        callback: data.phone !== '' ? (data.call ? '(Rückruf gewünscht)' : '(kein Rückruf)') : '',
        location: data.location !== '' ? data.location : 'kein Ort angegeben',
        message: data.message
      }
    }
  });

  /* Add to booking DB */
  await db.collection('booking').add({
    date: date
      ? {
          start: new Date(date.start),
          end: new Date(date.end)
        }
      : {},
    name: data.name,
    email: data.email,
    location: data.location,
    phone: data.phone,
    message: data.message
  });
});

export const verify = functions.https.onCall(async (data, context) => {
  const resp = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify?secret=' +
      functions.config().recaptcha.key +
      '&response=' +
      data +
      '&remoteip=' +
      context.rawRequest.ip
  );

  if (resp.status === 200) {
    return { status: 'ok' };
  } else {
    return { status: 'error' };
  }
});
