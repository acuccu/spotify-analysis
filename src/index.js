import "./styles/index.scss"




window.addEventListener("DOMContentLoaded", () => {
let trackId = "";
$(function() {
    
  $.get('/tracksearch', (data) => {
    // Display the track name
    
    // Display the album art
    var img = $('<img id="albumart"/>');
    img.attr('src', data.album.images[0].url);
    img.appendTo('#data-container');

    trackId = data.id;

  });

})



$.get(`/trackanalysis/${trackId}`, (data) => {
  // gets trackanalysis from searched trackId
  $('#data-container').text(data);
  console.log(trackId)
    
})
;})