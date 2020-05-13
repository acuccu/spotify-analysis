import d3Function from './d3Function';
window.addEventListener("DOMContentLoaded", () => {
document.getElementById("searchbutton").addEventListener("click", () => {
    d3Function(document.getElementById("search").value);
});
});