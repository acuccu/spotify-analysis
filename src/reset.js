const dataReset = function () {
    d3.select("#main").selectAll("*").remove();
    let img = $('<div id="track-image"></div>');
    img.appendTo("#main");
    let genre = $('<div id="genre-cloud"></div>');
    genre.appendTo("#main");
    let data = $('<div id="data-bars"></div>');
    data.appendTo("#main")
    let dataContainer = $('<div id="data-container"></div>');
    dataContainer.appendTo("#main")
}

export default dataReset