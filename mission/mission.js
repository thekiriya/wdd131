
const themeSelector = document.querySelector('#theme');
const body = document.querySelector('body');
const logo = document.querySelector('footer img.logo');

function changeTheme() {
  const theme = themeSelector.value;

  if (theme === 'dark') {
    body.classList.add('dark');
    logo.src = "images/byuilogo-white.png"; // white logo version
  } else {
    body.classList.remove('dark');
    logo.src = "images/byuilogo.png"; // blue logo version
  }
}

// Run changeTheme on page load to match the default value
changeTheme();


themeSelector.addEventListener('change', changeTheme);
