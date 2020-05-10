import "./styles/index.scss"

window.addEventListener("DOMContentLoaded", () => {
let trackId = "";
const features = ["danceability", "energy", "key", "valence", "tempo"]
$(function() {
    
  $.get('/tracksearch', (data) => {
    console.log(data);
    // Display the album art and artist information
    let img = $('<img id="albumart"/>');
    img.attr('src', data.album.images[0].url);
    img.appendTo('#track-image');
    let artist = $(`<div id="artist-info">
        <div>Artist: ${data.artists[0].name}</div>
        <div>Track: ${data.name}</div>
        </div>`);
    artist.appendTo('#track-image');

    //gets genres from artist
    $.get(`/album/${data.artists[0].id}`, (data) => {
      //creates a cloud of genres
      let d3Cloud = d3.select('#genre-cloud').selectAll('div');
        d3Cloud.data(data.body.genres).enter().append("div")
        .text((d) => {return d});    
    });


    
    // gets trackanalysis from searched trackId
    trackId = data.id;
    $.get(`/trackanalysis/${trackId}`, (data) => {
          let d3Data = Object.entries(data.body)
           .filter(el => features.includes(el[0]));
          let d3DataInterpreted = dataInterpretation(d3Data);

        
    // D3 logic
        let radialScale = d3.scaleLinear()
          .domain([0,10])
          .range([0,250]);
        let ticks = [2,4,6,8,10];

        let svg = d3.select("#main-container").append("svg")
          .attr("width", 700)
          .attr("height", 700);
        
          ticks.forEach(t =>
            svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 300)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", radialScale(t))
        );

        ticks.forEach(t =>
          svg.append("text")
          .attr("x", 305)
          .attr("y", 300 - radialScale(t))
          .text(t.toString())
      );

      function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": 300 + x, "y": 300 - y};
      };

      for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 10);
        let label_coordinate = angleToCoordinate(angle, 11.55);
      
        svg.append("line")
          .attr("x1", 300)
          .attr("y1", 300)
          .attr("x2", line_coordinate.x)
          .attr("y2", line_coordinate.y)
          .attr("stroke","black");
        
        svg.append("text")
          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y)
          .text(ft_name);
      };

    let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    function getPathCoordinates(data_point){
      let coordinates = [];
      for (var i = 0; i < features.length; i++){
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, (data_point[i][3])));
      };
      return coordinates;
    };

   
      let color = "darkorange";
      let coordinates = getPathCoordinates(d3DataInterpreted);
  
      svg.append("path")
      .datum(coordinates)
      .attr("d",line)
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);






          // let divSelection = d3.select('#data-container').selectAll('div');

          // divSelection.data(d3DataInterpreted).enter().append("div")
          // .text((d) => {
          //   return d[0] + ": " + d[2];})
      });
  })
});
});

// Interpretation functions

 const dataInterpretation = (data) => {
  
  let result = data.map((el) => {
    if (el[0] == "acousticness") {
    el.push(acousticness(el[1]));
    el.push(el[1] * 10);
    return el;
    } else if (el[0] == "danceability") {
      el.push(danceability(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "energy") {
      el.push(energy(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "instrumentalness") {
      el.push(instrumentalness(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "key") {
      el.push(key(el[1]));
      el.push(el[1]);
      return el;
    } else if (el[0] == "tempo") {
      el.push(Math.floor(el[1]));
      el.push((el[1]-50)/15);
      return el;
    } else if (el[0] == "valence") {
      el.push(valence(el[1]));
      el.push(el[1] * 10);
      return el;
    };
    
});
return result;
};

const acousticness = (datum) => {
  if (datum < 0.2) {
    return "Acoustic"
  } else if (datum < 0.4 ) {
    return "Mostly acoustic"
  } else {
    return "Not acoustic"
  }
};

const danceability = (datum) => {
  if (datum < 0.2) {
    return "Not danceable"
  } else if (datum < 0.4) {
    return "Slow Dance"
  } else if (datum < 0.6) {
    return "Got a beat"
  } else if (datum < 0.8) {
    return "Upbeat"
  } else {
    return "Banger"
  };
};

const energy = (datum) => {
  if (datum < 0.2) {
    return "Relaxing"
  } else if (datum < 0.4) {
    return "Low energy"
  } else if (datum < 0.6) {
    return "Andante" 
  } else if (datum < 0.8) {
    return "High energy"
  } else {
    return "It slaps"
  };
};

const instrumentalness = (datum) => {
  if (datum < 0.9) {
    return "Not instrumental"
  } else {
    return "Instrumental"
  };
};

const key = (datum) => {
  if (datum == 0) {
    return "Key of C"
  } else if (datum == 1) {
    return "Key of C♯, D♭"
  } else if (datum == 2) {
    return "Key of D"
  } else if (datum == 3) {
    return "Key of D♯, E♭"
  } else if (datum == 4) {
    return "Key of E"
  } else if (datum == 5) {
    return "Key of F"
  } else if (datum == 6) {
    return "Key of F♯, G♭"
  } else if (datum == 7) {
    return "Key of G" 
  } else if (datum == 8) {
    return "Key of G♯, A♭" 
  } else if (datum == 9) {
    return "Key of A" 
  } else if (datum == 10) {
    return "Key of A♯, B♭" 
  } else if (datum == 11) {
    return "Key of B" 
  } else {
    return "No key" 
  };
};

const valence = (datum) => {
  if (datum < 0.2) {
    return "Bleak"
  } else if (datum < 0.4) {
    return "Melancholic"
  } else if (datum < 0.6) {
    return "Serene" 
  } else if (datum < 0.8) {
    return "Happy"
  } else {
    return "Euphoric"
  };
}




