const token = JSON.parse(localStorage.getItem('loggedUser'))?.token;

// ✅ Load Existing Isibo Leaders
fetch('http://localhost:5000/api/leaders/isibo', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#isiboLeadersTable tbody');
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="8">Nta bayobozi b’isibo babonetse.</td></tr>';
      return;
    }

    data.forEach(leader => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${leader.full_name}</td>
        <td>${leader.national_id}</td>
        <td>${leader.phone || '-'}</td>
        <td>${leader.email || '-'}</td>
        <td>${leader.house}</td>
        <td>${leader.isibo}</td>
        <td>${leader.resident_type}</td>
        <td>${leader.role}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => {
    console.error(err);
    document.querySelector('#isiboLeadersTable tbody').innerHTML =
      '<tr><td colspan="8">Ntitwabashije kubona abakuru b’amasibo.</td></tr>';
  });

// ✅ Submit New Leader
document.getElementById('isiboLeaderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    full_name: document.getElementById('full_name').value,
    national_id: document.getElementById('national_id').value,
    phone: document.getElementById('phone_number').value,
    email: document.getElementById('email').value,
    house: document.getElementById('house').value,
    isibo: document.getElementById('isibo').value,
    resident_type: document.getElementById('resident_type').value,
    role: 'isibo_leader'
  };

  const response = await fetch('http://localhost:5000/api/leaders/isibo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (response.ok) {
    alert('Umuyobozi w’isibo yashyizweho neza!');
    window.location.reload();
  } else {
    alert('Ikibazo: ' + result.error);
  }
});
