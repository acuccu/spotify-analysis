const client_secret = require("../../node_modules/keys").client_secret;
const client_id = require("../../node_modules/keys").client_id;

const express = require('express');
const app = express();
app.use(express.static('public'));
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/index.html');
  });

const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyApi = new SpotifyWebApi({
    clientId : client_id,
    clientSecret : client_secret
  });

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
    console.log('authorization failed', err.message);
  });

  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });




