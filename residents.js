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
