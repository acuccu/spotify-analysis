import "./styles/index.scss"




window.addEventListener("DOMContentLoaded", () => {
let trackId = "";
const dataFilter = ["acousticness", "danceability", "energy", "instrumentalness", "key", "tempo", "valence"]
$(function() {
    
  $.get('/tracksearch', (data) => {
    // Display the track name
    
    // Display the album art
    var img = $('<img id="albumart"/>');
    img.attr('src', data.album.images[0].url);
    img.appendTo('#data-container');

    trackId = data.id;

    $.get(`/trackanalysis/${trackId}`, (data) => {
      // gets trackanalysis from searched trackId
      // $('#data-container').text(data.body.id);
      // console.log(data.body)
     let d3Data = Object.entries(data.body)
         .filter(el => dataFilter.includes(el[0]))
         
      // D3 logic
      let divSelection = d3.select('#data-container').selectAll('div');

      divSelection.data(d3Data).enter().append("div")
      .text((d) => {
        return d[0] + ": " + d[1];})
      })
  });
})
;})