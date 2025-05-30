// navbar.js
(function renderNav() {
  const token = JSON.parse(localStorage.getItem('loggedUser'))?.token;
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  const nav = document.getElementById('navLinks');
  if (!nav) return;

  const navItems = [];
  navItems.push(`<li><a href="home.html">Ahabanza</a></li>`);

  if (role === 'admin') {
    navItems.push(`<li><a href="residents.html">Abaturage</a></li>`);
    navItems.push(`<li><a href="thoughts.html">Ibitekerezo</a></li>`);
    navItems.push(`<li><a href="admin_dashboard.html">Dashboard</a></li>`);
  } else if (role === 'cell_leader') {
    navItems.push(`<li><a href="residents.html">Abaturage</a></li>`);
    navItems.push(`<li><a href="cell_inbox.html">Dashboard</a></li>`);
  } else if (role === 'isibo_leader') {
    navItems.push(`<li><a href="isibo_inbox.html">Dashboard</a></li>`);
  } else if (role === 'security') {
    navItems.push(`<li><a href="security_dashboard.html">Dashboard</a></li>`);
  } else {
    navItems.push(`<li><a href="contact.html">Twandikire</a></li>`);
    navItems.push(`<li><a href="my_messages.html">Ubutumwa Bwanjye</a></li>`);
  }

  navItems.push(`<li><a href="#" onclick="logout()">Sohoka</a></li>`);
  nav.innerHTML = navItems.join('');
})();

function logout() {
  localStorage.removeItem('loggedUser');
  window.location.href = 'login.html';
}

