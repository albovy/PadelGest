$(function() {
  $(".inscriptionButton").click(function() {
    let l = $(this).attr("idValue");
    console.log(l);
    let x = document.getElementById("formInsc");
    let s = "/inscription/tournament/" + l;
    console.log(s);
    x.action = s;
  });
});

$(function() {
  $(".concretarButton").click(function() {
    let l = $(this).attr("idValue");
    console.log(l);
    let x = document.getElementById("formInsc");
    let s = "/game/clash/" + l;
    console.log(s);
    x.action = s;
  });
});
// When the user clicks on the button, open the modal
