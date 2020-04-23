const secret_keys = require("./protected/keys.js");
const {client_secret, client_id} = secret_keys;

// import {client_id} from "/node_modules/keys"
// import {client_secret} from "/node_modules/keys"
// import express from "express"
// import { Server } from "net";
const server = require('net');
// import SpotifyWebApi from "SpotifyWebApi";

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;


app.use(express.static('dist'));
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/index.html');
  });

const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyApi = new SpotifyWebApi({
    clientId : client_id,
    clientSecret : client_secret
  });

SpotifyApi.clientCredentialsGrant()
  .then(function(data) {
    SpotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
    console.log('authorization failed', err.message);
  });

const listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});





