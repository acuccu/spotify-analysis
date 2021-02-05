import dataInterpretation from "./interpretation";

const d3Function = function(track) {
    
    console.log(track);
  let trackId = "";
  const features = ["danceability", "energy", "key", "valence", "tempo"] 
    
  $.get(`/tracksearch/${track}`, (data) => {
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

        
    // D3 logic -- grateful to yangdanny97.github.io for the tutorial
        let radialScale = d3.scaleLinear()
          .domain([0,10])
          .range([0,250]);
        let ticks = [2,4,6,8,10];

        let svg = d3.select("#data-container").append("svg")
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

      // displays the data text with 
      let divSelection = d3.select('#data-bars').selectAll('div');

          divSelection.data(d3DataInterpreted).enter().append("div")
          .text((d) => {
          return d[0] + ": " + d[2];})
      });
  })
}

export default d3Function