const user = JSON.parse(localStorage.getItem('loggedUser'));
const token = user?.token;

// ✅ Load Existing Cell Leader
fetch('http://localhost:5000/api/leaders/cell', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById('cellLeaderDisplay');
    if (!data || !data.full_name) {
      div.innerHTML = '<p>Umuyobozi w’Umudugudu ntaraboneka.</p>';
      return;
    }
    div.innerHTML = `
      <p><strong>Izina:</strong> ${data.full_name}</p>
      <p><strong>Telefone:</strong> ${data.phone_number || 'Nta telefone'}</p>
      <p><strong>Email:</strong> ${data.email || 'Nta email'}</p>
    `;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('cellLeaderDisplay').innerHTML =
      '<p>Ntitwashoboye kubona amakuru y’umuyobozi w’Umudugudu.</p>';
  });


// ✅ Handle Cell Leader Creation
document.getElementById('cellLeaderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    full_name: document.getElementById('full_name').value,
    
    phone_number: document.getElementById('phone_number').value,
    email: document.getElementById('email').value
  };

  const response = await fetch('http://localhost:5000/api/leaders/cell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (response.ok) {
    alert('Umuyobozi w’Umudugudu yashyizweho!');
    window.location.reload();
  } else {
    alert('Ikibazo: ' + result.error);
  }
});

