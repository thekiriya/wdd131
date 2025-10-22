
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

/* 
   Part 2 additions (append)
 
    */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menuToggle');
    const nav = document.getElementById('siteNav');

    // if the header elements aren't present, nothing to do
    if (btn && nav) {

      // Keep menu visibility consistent when window is resized.
 
      function handleResize() {
        if (window.innerWidth > 1000) {
          nav.classList.remove('hide');
        
          btn.setAttribute('aria-expanded', 'false');
        } else {
          // small screens: hide menu initially (user opens with button)
          if (!nav.classList.contains('hide')) nav.classList.add('hide');
          btn.setAttribute('aria-expanded', 'false');
        }
        
        nav.classList.remove('open');
      }

     
      window.addEventListener('resize', handleResize);
      handleResize();

      // Keep the button click in sync with the hide state.

      btn.addEventListener('click', () => {
        if (window.innerWidth <= 1000) {
          if (nav.classList.contains('hide')) {
            nav.classList.remove('hide');
            btn.setAttribute('aria-expanded', 'true');
          } else {
            nav.classList.add('hide');
            btn.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    /* -------------------------
       Image viewer (dialog)
  
       ------------------------- */
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    gallery.addEventListener('click', (event) => {
      const clickedImg = event.target.closest('img');
      if (!clickedImg) return;


      const existing = document.querySelector('dialog.viewer');
      if (existing) existing.remove();

  
      const dialog = document.createElement('dialog');
      dialog.className = 'viewer';
      dialog.setAttribute('aria-label', 'Image viewer');

      const src = clickedImg.getAttribute('src') || '';
      const alt = clickedImg.getAttribute('alt') || '';
      // robust-ish transform from small to full image name:
      // "norris-sm.jpeg" -> "norris-full.jpeg"
      const fullSrc = src.replace('-sm', '-full');

      dialog.innerHTML = `
        <img src="${fullSrc}" alt="${alt}">
        <button class="close-viewer" aria-label="Close viewer">X</button>
      `;

      document.body.appendChild(dialog);

      const closeBtn = dialog.querySelector('.close-viewer');

      // close button closes the dialog
      closeBtn.addEventListener('click', () => {
        dialog.close();
      });


      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
      });

  
      dialog.addEventListener('cancel', (e) => {
    
        e.preventDefault(); 
        dialog.close();
      });

      dialog.addEventListener('close', () => {

        dialog.remove();
      });

 
      dialog.showModal();
      closeBtn.focus();
    });
  });
})();
