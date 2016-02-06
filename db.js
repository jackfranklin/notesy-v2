import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-find'));

// swapped out by Webpack
const CLOUDANT_KEY = __CLOUDANT_KEY__;
const CLOUDANT_PASS = __CLOUDANT_PASS__;
const CLOUDANT_DB = __CLOUDANT_DB__;

const db = new PouchDB(CLOUDANT_DB);
const remote = 'https://' + CLOUDANT_KEY + ':' + CLOUDANT_PASS + '@jackfranklin.cloudant.com/' + CLOUDANT_DB;

db.sync(remote, {
  live: true,
  retry: true
});

// TODO: turn on db.compact every 5 minutes or so

db.createIndex({
  index: {
    fields: ['userId']
  }
});

function getAll(userId) {
  return db.find({
    selector: { userId }
  });
}

function findNoteById(id) {
  return db.find({
    selector: { _id: id }
  });
}

function createNote({ content, userId }) {
  return db.put({
    _id: (+(new Date())).toString(),
    content,
    userId
  });
}

function deleteNote(note) {
  note._deleted = true;
  return updateNote(note);
}

function updateNote(note) {
  return db.put(note);
}

export {
  getAll,
  createNote,
  findNoteById,
  updateNote,
  deleteNote
};

// db.changes({
//   since: 'now',
//   live: true
// }).on('change', function() {
//   console.log('DB change', [].slice.call(arguments));
// });

// db.put({
//   _id: new Date().toISOString(),
//   name: 'Jack Franklin'
// }, function (err, response) {
//   console.log(err || response);
// });

// db.allDocs({ include_docs: true }, function(err, doc) {
//   console.log('got docs', doc);
// });
