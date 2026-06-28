// ==================== LOAD LECTURERS FOR DROPDOWN ====================
async function loadLecturers() {
  const select = document.getElementById('lecturerId');
  if (!select) return;

  try {
    const data = await apiRequest('/projects/lecturers');
    select.innerHTML = '<option value="">Select a Lecturer</option>';

    if (data && data.length > 0) {
      data.forEach(l => {
        select.innerHTML += `<option value="${l.id}">${l.name}</option>`;
      });
    } else {
      select.innerHTML = '<option value="">No lecturers available</option>';
    }
  } catch (err) {
    console.error(err);
    select.innerHTML = '<option value="">Error loading lecturers</option>';
  }
}

// ==================== UPLOAD PROJECT WITH LECTURER ====================
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const lecturerId = document.getElementById('lecturerId').value;
  const file = document.getElementById('projectFile').files[0];

  if (!title) return alert("❌ Project title is required");
  if (!lecturerId) return alert("❌ Please select a lecturer");
  if (!file) return alert("❌ Please select a PDF file");

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('lecturer_id', lecturerId);
  formData.append('project', file);

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/projects/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Project uploaded and assigned to lecturer successfully!');
      document.getElementById('uploadForm').reset();
      loadMyProjects();
    } else {
      alert('❌ ' + (data.message || 'Upload failed'));
    }
  } catch (err) {
    console.error(err);
    alert('❌ Upload failed. Make sure backend is running.');
  }
});

// ==================== LOAD MY PROJECTS ====================
async function loadMyProjects() {
  try {
    const data = await apiRequest('/projects/my/list');
    const container = document.getElementById('myProjectsList');
    if (container) {
      container.innerHTML = data?.length ? data.map(p => `
        <div class="p-4 bg-gray-50 rounded-2xl border">
          <h4 class="font-medium">${p.title}</h4>
          <p class="text-sm text-gray-500">Status: <span class="capitalize">${p.status}</span></p>
        </div>
      `).join('') : '<p class="text-gray-500">No projects yet.</p>';
    }
  } catch (err) {
    console.error(err);
  }
}

// Auto Load
document.addEventListener('DOMContentLoaded', () => {
  loadLecturers();
  loadMyProjects();
});

// Auto Load
document.addEventListener('DOMContentLoaded', () => {
  loadLecturers();
  loadMyProjects();
});


async function loadMyProjects() {
  try {
    const data = await apiRequest('/projects/my/list');
    const container = document.getElementById('myProjectsList');
    
    if (container) {
      if (data && data.length > 0) {
        container.innerHTML = data.map(p => `
          <div class="p-4 bg-gray-50 rounded-2xl border">
            <h4 class="font-medium">${p.title}</h4>
            <p class="text-sm text-gray-500">Status: <span class="capitalize">${p.status}</span></p>
            
            ${p.file_path ? `
              <a href="${window.location.origin}${p.file_path}" 
                 target="_blank"
                 class="inline-flex items-center gap-2 mt-3 text-blue-600 hover:underline">
                📄 Download PDF
              </a>
            ` : ''}
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p class="text-gray-500">No projects yet.</p>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Auto Load
document.addEventListener('DOMContentLoaded', () => {
  loadLecturers();
  loadMyProjects();
});

// ==================== LECTURER: LOAD ASSIGNED PROJECTS ====================
async function loadAssignedProjects() {
  const container = document.getElementById('assignedProjectsList');
  if (!container) return;

  try {
    const data = await apiRequest('/projects/assigned/list');
    
    if (data && data.length > 0) {
      container.innerHTML = data.map(p => `
        <div class="bg-white p-6 rounded-2xl shadow border">
          <h3 class="font-semibold text-lg">${p.title}</h3>
          <p class="text-sm text-gray-600">Student: ${p.student_name}</p>
          <p class="text-sm mt-1">Status: <span class="capitalize font-medium text-blue-600">${p.status}</span></p>
          
          <div class="mt-4 flex gap-4">
            <a href="http://localhost:5000${p.file_path}" target="_blank" 
               class="text-blue-600 hover:underline">📄 Download PDF</a>
            
            <button onclick="updateProjectStatus(${p.id}, 'approved')" 
                    class="text-green-600 hover:underline">Approve</button>
            <button onclick="updateProjectStatus(${p.id}, 'rejected')" 
                    class="text-red-600 hover:underline">Reject</button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<p class="text-gray-500 py-12 text-center">No projects assigned to you yet.</p>`;
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-500">Error loading projects</p>`;
  }
}

// Update status function
async function updateProjectStatus(projectId, status) {
  if (!confirm(`Mark as ${status}?`)) return;

  try {
    const res = await fetch(`http://localhost:5000/api/projects/${projectId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      alert(`Project ${status}!`);
      loadAssignedProjects();
    }
  } catch (err) {
    console.error(err);
  }
}

// Update Project Status (for Lecturers)
async function updateProjectStatus(projectId, status) {
  if (!confirm(`Mark this project as ${status}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      alert(`Project marked as ${status}!`);
      loadAssignedProjects();
    } else {
      alert('Failed to update status');
    }
  } catch (err) {
    console.error(err);
    alert('Error updating status');
  }
}

// Debug: Check your role
console.log("Current User:", getUser());