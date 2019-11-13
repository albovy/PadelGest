

$(function(){
  $(".modal-btn").click(function(){

    let l = $(this).attr("idValue");
    ShowModal(l);
  });
});
function ShowModal(id) {
  console.log(id);
  
  let modal = document.getElementById("modal-"+ id);
  console.log(modal);
  modal.style.display = "block";
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// When the user clicks on the button, open the modal
