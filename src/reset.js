const dataReset = function () {
    d3.select("#main").selectAll("*").remove();
    let info = $('<div id="info"><div id="data-top"><div id="track-image"></div><div id="genre-cloud"></div></div><div id="data-bars"></div></div>');
    info.appendTo("#main");
    let dataContainer = $('<div id="data-container"></div>');
    dataContainer.appendTo("#main")
    let labels = $('<div id="energy" >Energy</div><div id="danceability" >Danceability</div><div id="tempo" >Tempo</div><div id="valence" >Valence</div><div id="keytag" >Key</div>');
    labels.appendTo("#main")
}

export default dataReset