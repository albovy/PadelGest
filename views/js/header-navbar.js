addEventListener('load', function () {

  topnavDisplay();

  // When the user scrolls the page, execute stickyHeader
  window.onscroll = function () { stickyHeader() };

  // Get the header
  let header = document.getElementById("myHeader");
  let navbar = document.getElementById("myTopnav");
  let stickyNavbar = document.querySelectorAll("sticky-nav");

  // Get the offset position of the navbar
  let sticky = header.offsetTop + navbar.offsetTop;


  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function stickyHeader() {
    if (document.documentElement.scrollHeight > 1200) {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        if (window.innerWidth > 950) {
          navbar.style.top = header.scrollHeight + header.getBoundingClientRect().top + 'px';
          navbar.classList.add("sticky-nav");
        }

      } else {
        header.classList.remove("sticky");
        navbar.classList.remove("sticky-nav");
      }
    }
  }
}, false);

function topnavDisplay() {
  let topnav = document.getElementById("myTopnav");
  if (topnav.className === "topnav") {
    topnav.className += " responsive";
  } else {
    topnav.className = "topnav";
  }
}
