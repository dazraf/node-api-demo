'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
app.use( bodyParser.json() );
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
  var response = Array.from(Object.keys(wallets)).map(function (it) {
    return {
      id: it,
      link: "/api/wallets/" + it
    }
  })
  sendJson(res, response);
});

app.get('/api/wallets/:wallet', (req, res) => {
  var wallet = req.params.wallet;
  if (wallet in wallets) {
    sendJson(res, wallets[wallet])
  } else {
    sendError(res, "wallet not found: " + wallet)
  }
});

app.post('/api/wallets', (req, res) => {
  var wallet = req.body;
  try {
    var name = getProperty(wallet, 'name');
    var sortCode = getProperty(wallet, 'sortCode');
    var account = getProperty(wallet, 'account');  
    var response = createWallet(name, account, sortCode);
    sendJson(res, response);
  } catch (err) {
    sendError(err)
  }
});

if (module === require.main) {
  // [START server]
  // Start the server
  var port = process.env.PORT || 8081;
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

function sendError(res, msg) {
  res.status(500, msg).send(msg)
}

function createWallet(name, account, sortCode) {
  var id = "w" + nextId++;
  var wallet = {
    id: id,
    name: name,
    account: account,
    sortCode: sortCode,
    balance: 0,
    link: "/api/wallets/" + id
  };
  wallets[id] = wallet;
  return wallet;
}

function getProperty(obj, property) {
  if (obj.hasOwnProperty(property)) {
    return obj[property]
  } else {
    throw "object doesn't have property: " + property
  }
}

createWallet("Oliver", "11223344", "112233");
module.exports = app;