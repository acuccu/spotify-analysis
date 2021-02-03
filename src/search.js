import d3Function from './d3Function';
import dataReset from './reset';

window.addEventListener("DOMContentLoaded", () => {
document.getElementById("searchbutton").addEventListener("click", () => {
    event.preventDefault()
    dataReset();
    d3Function(document.getElementById("search").value);
});
});