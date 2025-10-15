
// This makes the menu button show and hide the navigation links.

const menuButton = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#siteNav");


if (menuButton && navLinks) {

  menuButton.addEventListener("click", function () {
    // toggle the "open" class on the nav
    navLinks.classList.toggle("open");


    const isOpen = navLinks.classList.contains("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });


  const links = navLinks.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", false);
    });
  });
}
