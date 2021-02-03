const dataReset = function () {
    d3.select("#main-container").selectAll("*").remove();
    let img = $('<div id="track-image"></div>');
    img.appendTo("#main-container");
    let genre = $('<div id="genre-cloud"></div>');
    genre.appendTo("#main-container");
    let data = $('<div id="data-bars"></div>');
    data.appendTo("#main-container")
}

export default dataReset