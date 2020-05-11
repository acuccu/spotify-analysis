const secret_keys = require("./public/keys.js");
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

  app.get('/tracksearch', function (request, response) {
    const tracks = ['what you need', 'star shopping', 'honey bucket', 'dopethrone', 'archcarrier', 'alberto balsalm', 'crushed up', 'lotto', 'bachelorette', 'love will tear us apart', 'for want of', 'the bells', 'can you feel it', 'catch me outside', 'fascination street']
  
    // Search for a track!
    SpotifyApi.searchTracks(`track:${tracks[Math.floor(Math.random() * tracks.length)]}`, {limit: 1})
      .then((data) => {
      
        // Send the first (only) track object
        response.send(data.body.tracks.items[0]);
      
      }, function(err) {
        console.error(err);
      });
  });

  app.get ('/trackanalysis/:id', (request, response) => {
    SpotifyApi.getAudioFeaturesForTrack(request.params.id)
      .then((data) => {
      response.send(data)
      }, function(err) {
        console.error(err);});
  });

  app.get ('/album/:id', (request, response) => {
    SpotifyApi.getArtist(request.params.id)
    .then((data) => {
      response.send(data)
    }, function(err) {
      console.error(err);});
  });

 
  

const listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});





