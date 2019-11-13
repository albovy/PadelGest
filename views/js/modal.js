window.onload = function () {

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];

  

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

function ShowModal(id){
  
  let modal = document.getElementById("model-"+id);
  modal.style.display = "block";
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
}

// When the user clicks on the button, open the modal
