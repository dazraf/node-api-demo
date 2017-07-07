'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const config = require('./config');
const store = require('./store');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  // support URL-encoded bodies
  extended: true
}));
var nextId = 1;

const wallets = {};

// retrieve intro screen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// retrieve existing wallets
app.get('/api/wallets', (req, res) => {
  getAllwallets(res, [], false);
});

app.get('/api/wallets/:wallet', (req, res) => {
  let wallet = req.params.wallet;
  store.read(wallet, (err, data) => {
    if (err) {
      sendError(res, err)
    } else {
      sendJson(res, addLink(data) );
    }
  });
});

app.post('/api/wallets', (req, res) => {
  let wallet = req.body;
  try {
    let name = getProperty(wallet, 'name');
    let sortCode = getProperty(wallet, 'sortCode');
    let account = getProperty(wallet, 'account');
    let response = createWallet(name, account, sortCode, function (err, data) {
      if (err == null) {
        sendJson(res, data);
      } else {
        sendError(res, err);
      }
    });
  } catch (err) {
    sendError(err)
  }
});

if (module === require.main) {
  // [START server]
  // Start the server
  let port = process.env.PORT || 8081;
  const server = app.listen(port, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
    console.log("browse to http://localhost:" + port);
  });
  // [END server]
}

function sendJson(res, obj) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(JSON.stringify(obj))
}

function sendError(res, err) {
  let msg = "Error: " + JSON.stringify(err);
  console.error(msg);
  res.status(400, msg).send(msg)
}

function getAllwallets(res, list) {
  store.list(function (err, data, token) {
    if (err != null) {
      sendError(res, err);
      return;
    }

    sendJson(res, data.map(addLink));
  });
}

function addLink(it) {
  it.link = "/api/wallets/" + it.id;
  return it;
}

function createWallet(name, account, sortCode, cb) {
  let wallet = {
    name: name,
    account: account,
    sortCode: sortCode,
    balance: 0
  };
  store.create(wallet, function (err, data) {
    cb(err, addLink(data));
  });
}

function getProperty(obj, property) {
  if (obj.hasOwnProperty(property)) {
    return obj[property]
  } else {
    throw "object doesn't have property: " + property
  }
}

module.exports = app;