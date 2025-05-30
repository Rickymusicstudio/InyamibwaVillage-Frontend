// residents.js

const token = JSON.parse(localStorage.getItem("loggedUser"))?.token;

if (!token) {
  alert("Access denied.");
  window.location.href = "login.html";
}

const headers = { Authorization: "Bearer " + token };

// 🛡️ Decode token to get role
const role = JSON.parse(atob(token.split('.')[1]))?.role;
const canViewID = ['admin', 'cell_leader', 'isibo_leader', 'security'].includes(role);

// 🌐 Dynamic API base URL
const API = window.API_BASE_URL;

function maskID(id) {
  return id?.length >= 4
    ? id.slice(0, 2) + '••••••••' + id.slice(-2)
    : '••••••••••';
}

const residentsTableBody = document.querySelector("#residentsTable tbody");
const residentSearchInput = document.getElementById("residentSearch");

// ✅ Create a row for residents (with delete button if admin)
function createResidentRow(person) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${person.full_name}</td>
    <td>${canViewID ? person.national_id : maskID(person.national_id)}</td>
    <td>${person.phone_number}</td>
    <td>${person.email || '-'}</td>
    <td>${person.house || '-'}</td>
    <td>${person.isibo || '-'}</td>
    <td>${person.resident_type || '-'}</td>
    <td>
      ${
        role === 'admin'
          ? `<button onclick="deleteResident('${person.id}')" class="delete-btn">Siba</button>`
          : ''
      }
    </td>
  `;
  return tr;
}

// ✅ Fetch and display residents
fetch(`${API}/api/residents`, { headers })
  .then((res) => res.json())
  .then((data) => {
    residentsTableBody.innerHTML = "";
    data.forEach((resident) => {
      const tr = createResidentRow(resident);
      residentsTableBody.appendChild(tr);
    });

    residentSearchInput.addEventListener("input", () => {
      const searchTerm = residentSearchInput.value.toLowerCase();
      const rows = residentsTableBody.querySelectorAll("tr");
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
      });
    });
  })
  .catch((err) => {
    console.error("Error fetching residents:", err);
    residentsTableBody.innerHTML = "<tr><td colspan='8'>Habaye ikibazo mu kubona abaturage.</td></tr>";
  });

// ✅ Delete Resident (only for admin)
function deleteResident(id) {
  if (!confirm('Wemeza ko ushaka gusiba uyu muturage?')) return;

  fetch(`${API}/api/residents/${id}`, {
    method: 'DELETE',
    headers
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Umuturage yasibwe.');
      window.location.reload();
    })
    .catch(() => alert('Ntibyakunze gusiba.'));
}

// ✅ Fetch and display Isibo Leaders
const isiboLeadersTableBody = document.querySelector("#isiboLeadersTable tbody");
fetch(`${API}/api/leaders/isibo`, { headers })
  .then(res => res.json())
  .then(data => {
    isiboLeadersTableBody.innerHTML = "";
    data.forEach((leader) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${leader.full_name}</td>
        <td>${canViewID ? leader.national_id : maskID(leader.national_id)}</td>
        <td>${leader.phone_number || '-'}</td>
        <td>${leader.email || '-'}</td>
        <td>${leader.house || '-'}</td>
        <td>${leader.isibo || '-'}</td>
        <td>${leader.resident_type || '-'}</td>
      `;
      isiboLeadersTableBody.appendChild(tr);
    });
  })
  .catch((err) => {
    console.error("Error fetching isibo leaders:", err);
    isiboLeadersTableBody.innerHTML = "<tr><td colspan='7'>Habaye ikibazo mu kubona abatwarasibo.</td></tr>";
  });

// ✅ Fetch and display Security Leader
const securityLeaderDiv = document.getElementById("securityLeaderInfo");
fetch(`${API}/api/leaders/security`, { headers })
  .then(res => res.json())
  .then(leader => {
    securityLeaderDiv.innerHTML = `
      <p><strong>Izina:</strong> ${leader.full_name}</p>
      <p><strong>Indangamuntu:</strong> ${canViewID ? leader.national_id : maskID(leader.national_id)}</p>
      <p><strong>Telefone:</strong> ${leader.phone_number || '-'}</p>
      <p><strong>Email:</strong> ${leader.email || '-'}</p>
      <p><strong>Inzu:</strong> ${leader.house || '-'}</p>
      <p><strong>Isibo:</strong> ${leader.isibo || '-'}</p>
      <p><strong>Uburyo atuyemo:</strong> ${leader.resident_type || '-'}</p>
    `;
  })
  .catch((err) => {
    console.error("Error fetching security leader:", err);
    securityLeaderDiv.innerHTML = "<p>Habaye ikibazo mu kubona Umukuru w’Umutekano.</p>";
  });

// ✅ Fetch and display Cell Leader
const cellLeaderDiv = document.getElementById("cellLeaderInfo");
fetch(`${API}/api/leaders/cell`, { headers })
  .then(res => res.json())
  .then(leader => {
    cellLeaderDiv.innerHTML = `
      <p><strong>Izina:</strong> ${leader.full_name}</p>
      <p><strong>Indangamuntu:</strong> ${canViewID ? leader.national_id : maskID(leader.national_id)}</p>
      <p><strong>Telefone:</strong> ${leader.phone_number || '-'}</p>
      <p><strong>Email:</strong> ${leader.email || '-'}</p>
      <p><strong>Inzu:</strong> ${leader.house || '-'}</p>
      <p><strong>Isibo:</strong> ${leader.isibo || '-'}</p>
      <p><strong>Uburyo atuyemo:</strong> ${leader.resident_type || '-'}</p>
    `;
  })
  .catch((err) => {
    console.error("Error fetching cell leader:", err);
    cellLeaderDiv.innerHTML = "<p>Habaye ikibazo mu kubona Umukuru w’Umudugudu.</p>";
  });
