import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-find'));

// swapped out by Webpack
const CLOUDANT_KEY = __CLOUDANT_KEY__;
const CLOUDANT_PASS = __CLOUDANT_PASS__;

const db = new PouchDB('notesy-dev');
const remote = 'https://' + CLOUDANT_KEY + ':' + CLOUDANT_PASS + '@jackfranklin.cloudant.com/notesy-dev';

db.sync(remote, {
  live: true,
  retry: true
});

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

function createNote({ content, userId }) {
  return db.put({
    _id: (+(new Date())).toString(),
    content,
    userId
  });
}

export {
  db,
  getAll,
  createNote
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
