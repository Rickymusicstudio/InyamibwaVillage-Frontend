(function () {
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const token = loggedUser?.token;

  if (!token) {
    alert('Access denied.');
    window.location.href = 'login.html';
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;

  window.token = token;
  window.role = role;

  window.renderNav = function (activePage = '') {
    const nav = document.getElementById('navLinks');
    if (!nav) return;

    const links = [];

    links.push(navLink('home.html', 'Ahabanza', activePage === 'home'));
    links.push(navLink('residents.html', 'Abaturage', activePage === 'residents'));
    links.push(navLink('thoughts.html', 'Ibitekerezo', activePage === 'thoughts'));

    if (['resident', 'cell_leader', 'isibo_leader', 'security'].includes(role)) {
      links.push(navLink('contact.html', 'Twandikire', activePage === 'contact'));

      if (role === 'resident') {
        links.push(navLink('my_messages.html', 'Ubutumwa Bwanjye', activePage === 'my_messages'));
      }
    }

    if (['resident', 'cell_leader', 'isibo_leader', 'security'].includes(role)) {
      links.push(navLink('my_house_helper.html', 'Umukozi wanjye', activePage === 'my_house_helper'));
    }

    if (role === 'cell_leader') {
      links.push(navLink('dashboard.html', 'Dashboard', activePage === 'dashboard'));
      links.push(navLink('profile.html', 'Umukuru w’Umudugudu', activePage === 'profile'));
    } else if (role === 'isibo_leader') {
      links.push(navLink('isibo_inbox.html', 'Dashboard', activePage === 'isibo_inbox'));
    } else if (role === 'security') {
      links.push(navLink('security_dashboard.html', 'Dashboard', activePage === 'security_dashboard'));
      links.push(navLink('irondo.html', 'Abanyerondo', activePage === 'irondo'));
    } else if (role === 'admin') {
      links.push(navLink('admin_dashboard.html', 'Dashboard', activePage === 'admin_dashboard'));
    }

    links.push(`<li><a href="#" onclick="logout()">Sohoka</a></li>`);
    nav.innerHTML = links.filter(Boolean).join('').trim();
  };

  function navLink(href, label, isActive) {
    return `<li><a href="${href}" ${isActive ? 'class="active"' : ''}>${label}</a></li>`;
  }

  window.logout = function () {
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  };

  // ========================================
  // Dynamic CSS Class Additions on Page Load
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    // Add button styles
    document.querySelectorAll('button').forEach(btn => {
      btn.classList.add('btn');
    });

    // Add delete button styles
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.classList.add('btn', 'btn-danger');
    });

    // Add rounded and shadow to updates
    document.querySelectorAll('.update').forEach(block => {
      block.classList.add('rounded', 'shadow');
    });

    // Add standard styles to form elements
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.classList.add('input');
    });
  });
})();
