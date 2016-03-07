require('dotenv').config();

import PouchDB from 'pouchdb';
const fileContents = require('../data-to-import.json');

const CLOUDANT_KEY = process.env.CLOUDANT_DEV_KEY;
const CLOUDANT_PASS = process.env.CLOUDANT_DEV_PASS;
const CLOUDANT_DB = process.env.CLOUDANT_DEV_DB;

const db = new PouchDB(CLOUDANT_DB);
const remote = 'https://' + CLOUDANT_KEY + ':' + CLOUDANT_PASS + '@jackfranklin.cloudant.com/' + CLOUDANT_DB;

db.sync(remote, {
  live: true,
  retry: true
});

const userId = '193238';

function createNote({ id, content }) {
  return db.put({
    _id: id,
    content,
    userId
  });
}

const { rows } = fileContents;


console.log('Rows', rows.length);

const rowCreationPromises = rows.map((row) => {
  const newNoteId = row.doc.createdAt.toString();
  const content = row.doc.text;

  return createNote({
    id: newNoteId,
    content
  }).then((data) => {
    console.log('Created note', data);
  }).catch((e) => {
    console.log('ERROR', newNoteId, e.message);
  });
});

Promise.all(rowCreationPromises).then(() => {
  console.log('Finished creating notes');
});

