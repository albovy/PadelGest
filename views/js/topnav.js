function topnavDisplay() {
  let topnav = document.getElementById("myTopnav");
  if (topnav.className === "topnav") {
    topnav.className += " responsive";
  } else {
    topnav.className = "topnav";
  }
} 