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

const spotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new spotifyWebApi({
    clientId : client_id,
    clientSecret : client_secret
  });

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
    console.log('authorization failed', err.message);
  });

  app.get('/tracksearch/:id', function (request, response) {

    const tracks = ['what you need', 'star shopping', 'honey bucket', 'dopethrone', 'archcarrier', 'alberto balsalm', 'crushed up', 'lotto', 'bachelorette', 'love will tear us apart', 'for want of', 'the bells', 'can you feel it', 'catch me outside', 'fascination street']
    
      let data = request.params.id === "undefined" ? tracks[Math.floor(Math.random() * tracks.length)] : request.params.id;
      // if (request.params.id === undefined ) {
      //    let data = tracks[Math.floor(Math.random() * tracks.length)];
      // } else {
      //     let data = request.params.id;
      // };
  
    // Search for a track!
    spotifyApi.searchTracks(`track:${data}`, {limit: 1})
      .then((data) => {
      response.send(data.body.tracks.items[0]);
      }, function(err) {
      console.error(err);
      });
  });

  app.get ('/trackanalysis/:id', (request, response) => {
    spotifyApi.getAudioFeaturesForTrack(request.params.id)
      .then((data) => {
      response.send(data)
      }, function(err) {
        console.error(err);});
  });

  app.get ('/album/:id', (request, response) => {
    spotifyApi.getArtist(request.params.id)
    .then((data) => {
      response.send(data)
    }, function(err) {
      console.error(err);});
  });



 
  

const listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});





