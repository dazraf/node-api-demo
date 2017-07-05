'use strict';

const express = require('express');
var path = require('path');
const app = express();

const wallets = {
  "w1": {
    "id": "w1",
    "name": "Oliver",
    "balance": 100000,
    "account": "11223344",
    "sortCode": "112233"
  }
};

// retrieve intro screen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// retrieve existing wallets
app.get('/wallets', (req, res) => {
  sendJson(res, wallets)
});

app.get('/wallets/:wallet', (req, res) => {
  var wallet = req.params.wallet;
  if (wallet in wallets) {
    sendJson(res, wallets[wallet])
  } else {
    sendError(res, "wallet not found: " + wallet)
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

module.exports = app;