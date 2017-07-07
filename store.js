'use strict';
const Datastore = require('@google-cloud/datastore');
const config = require('./config');

const ds = Datastore({
  projectId: config.get('GCLOUD_PROJECT')
});
const kind = 'Wallet';

function fromDatastore(obj) {
  obj.id = obj[ds.KEY].id;
  return obj;
}

function fromDatastoreAsRef(obj) {
  let tx = fromDatastore(obj);
  return {
    id: tx.id,
    link: tx.link
  };
}

function toDatastore(obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  let results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}

function update(id, data, cb) {
  let key;
  if (id) {
    key = ds.key([kind, parseInt(id, 10)]);
  } else {
    key = ds.key(kind);
  }

  const entity = {
    key: key,
    data: toDatastore(data, [])
  };

  ds.save(
    entity,
    (err) => {
      data.id = key.id;
      cb(err, err ? null : data);
    }
  );
}

function create(data, cb) {
  update(null, data, cb);
}

function list(cb) {
  let q = ds.createQuery(kind);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
    } else {
      cb(null, entities.map(fromDatastoreAsRef));
    }
  });
}

function read(id, cb) {
  let key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, (err, entity) =>  {
    if (err) {
      cb(err);
    } else {
      cb(null, fromDatastore(entity));
    }
  });
}

module.exports = {
  create,
  read,
  update,
  // delete: _delete,
  list
}