const token = JSON.parse(localStorage.getItem('loggedUser'))?.token;

// ✅ Fetch current security leader
fetch('http://localhost:5000/api/leaders/security', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById('securityLeaderDisplay');
    if (!data || !data.full_name) {
      div.innerHTML = '<p>Umuyobozi w’Umutekano ntaraboneka.</p>';
      return;
    }
    div.innerHTML = `
      <p><strong>Izina:</strong> ${data.full_name}</p>
      <p><strong>Indangamuntu:</strong> ${data.national_id}</p>
      <p><strong>Telefone:</strong> ${data.phone_number || '-'}</p>
      <p><strong>Email:</strong> ${data.email || '-'}</p>
      <p><strong>Inzu:</strong> ${data.house || '-'}</p>
      <p><strong>Isibo:</strong> ${data.isibo || '-'}</p>
      <p><strong>Uburyo atuyemo:</strong> ${data.resident_type || '-'}</p>
    `;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('securityLeaderDisplay').innerHTML =
      '<p>Ntitwashoboye kubona amakuru y’umuyobozi w’Umutekano.</p>';
  });

// ✅ Submit new leader with full info
document.getElementById('securityLeaderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
  full_name: document.getElementById('full_name').value,
  national_id: document.getElementById('national_id').value,
  phone_number: document.getElementById('phone_number').value,  // ✅ use correct key
  email: document.getElementById('email').value,
  house: document.getElementById('house').value,
  isibo: document.getElementById('isibo').value,
  resident_type: document.getElementById('resident_type').value,
  password: document.getElementById('password').value,
  role: 'security_leader'
};
  try {
    const response = await fetch('http://localhost:5000/api/leaders/security', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Umuyobozi w’Umutekano yashyizweho!');
      window.location.reload();
    } else {
      alert('Ikibazo: ' + (result.error || 'Ntibyakunze.'));
    }
  } catch (err) {
    alert('Habaye ikibazo ku murongo.');
    console.error(err);
  }
});
