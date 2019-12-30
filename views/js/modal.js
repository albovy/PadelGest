$(function() {
  $(".inscriptionButton").click(function() {
    let l = $(this).attr("idValue");
    let m = $(this).attr("amount");
    console.log(l);
    let x = document.getElementById("formInsc");
    let s = "/inscription/tournament/" + l + "/" + m;
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

$(function() {
  $(".gameButton").click(function() {
    let l = $(this).attr("idValue");
    console.log(l);
    let x = document.getElementById("formInsc");
    let s = "/game/results/" + l;
    console.log(s);
    x.action = s;
  });
});

$(function() {
  $(".promotedInscriptionButton").click(function() {
    let l = $(this).attr("idValue");
    let m = $(this).attr("amount");
    console.log(m);
    let x = document.getElementById("formInsc");
    let s = "/promotedInscription/add/" + l + "/" + m;
    console.log(s);
    x.action = s;
  });
});

$(function() {
  $(".results").blur(function() {

    let x = document.getElementById("set1_team1");
    let y = document.getElementById("set2_team1");
    let z = document.getElementById("set1_team2");
    let w = document.getElementById("set2_team2");
    if (x.value != "" && y.value != "" && z.value != "" && w.value != "") {
      let g = document.getElementById("set3_team1");
      let j = document.getElementById("set3_team2");
      if((x.value > z.value && y.value > w.value )||(z.value>x.value && w.value > y.value) ){
        console.log("holaa");
        g.readOnly= true;
        j.readOnly= true;
      }else{
        g.removeAttribute("readonly");
        j.removeAttribute("readonly");
      }
    }
  });
});
// When the user clicks on the button, open the modal
