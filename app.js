'use strict';

const express = require('express');

const app = express();

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, Oliver!');
});
// [END hello_world]

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

module.exports = app;