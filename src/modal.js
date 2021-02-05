let modal = document.getElementById("modal");

let closeBtn = document.getElementById("closeBtn");

closeBtn.onclick = function() {
    modal.style.display = "none";
  }

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

