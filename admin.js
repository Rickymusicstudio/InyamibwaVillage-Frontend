document.getElementById('leader-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  let endpoint;
  switch (data.role) {
    case 'isibo':
      endpoint = '/api/leaders/isibo';
      break;
    case 'cell':
      endpoint = '/api/leaders/cell';
      break;
    case 'security':
      endpoint = '/api/leaders/security';
      break;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  if (response.ok) {
    alert(`${data.role} yanditswe neza!`);
    e.target.reset();
  } else {
    alert('Ikosa: ' + result.error);
  }
});
.
