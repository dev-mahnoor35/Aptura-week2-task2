document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const themeToggle = document.getElementById("themeToggle");
  const themeText = document.getElementById("themeText");

  // Toggle Left Sidebar
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // Toggle Dark/Light Theme
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        themeText.textContent = "Light Mode";
        themeToggle.querySelector("i").className = "fa-solid fa-sun";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeText.textContent = "Dark Mode";
        themeToggle.querySelector("i").className = "fa-solid fa-moon";
      }
    });
  }
});
// ----------------------------------------------------
// 1. DYNAMIC REALTIME VISITORS & VIEWS COUNTER LOGIC
// ----------------------------------------------------
function initDynamicCounters() {
  let sessions = parseInt(localStorage.getItem('dm_sessions')) || 124444;
  let users = parseInt(localStorage.getItem('dm_users')) || 64496;
  let views = parseInt(localStorage.getItem('dm_views')) || 442278;

  // Har bar page visit par view & session automatic barhega
  views += 1;
  sessions += 1;
  localStorage.setItem('dm_views', views);
  localStorage.setItem('dm_sessions', sessions);

  function renderCounters() {
    const sessEl = document.getElementById('session-count');
    const userEl = document.getElementById('users-count');
    const viewEl = document.getElementById('views-count');

    if (sessEl) sessEl.innerText = sessions.toLocaleString();
    if (userEl) userEl.innerText = users.toLocaleString();
    if (viewEl) viewEl.innerText = views.toLocaleString();
  }

  renderCounters();

  // Har 3 sec baad active users random kam/zayada hoty rahen gy (Live Feeling)
  setInterval(() => {
    const fluctuation = Math.floor(Math.random() * 9) - 4; // -4 to +4
    users = Math.max(1000, users + fluctuation);
    
    // Kabhi kabhi view b barhega
    if (Math.random() > 0.5) {
      views += Math.floor(Math.random() * 3) + 1;
    }
    
    localStorage.setItem('dm_users', users);
    localStorage.setItem('dm_views', views);
    renderCounters();
  }, 3000);
}

// ----------------------------------------------------
// 2. CHART.JS GRAPHICAL CHARTS INITIALIZATION
// ----------------------------------------------------
function initCharts() {
  // Active Visitors Donut Chart
  const ctxVisitors = document.getElementById('activeVisitorsChart');
  if (ctxVisitors) {
    new Chart(ctxVisitors, {
      type: 'doughnut',
      data: {
        labels: ['Organic', 'Direct', 'Referral'],
        datasets: [{
          data: [45, 30, 25],
          backgroundColor: ['#06b6d4', '#ec4899', '#3b82f6'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Visitors by Type Bar Chart
  const ctxType = document.getElementById('visitorsTypeChart');
  if (ctxType) {
    new Chart(ctxType, {
      type: 'bar',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          label: 'Visitors',
          data: [650, 420, 180],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Traffic History Line Chart
  const ctxTraffic = document.getElementById('trafficHistoryChart');
  if (ctxTraffic) {
    new Chart(ctxTraffic, {
      type: 'line',
      data: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        datasets: [{
          label: 'Monthly Traffic (K)',
          data: [120, 190, 300, 250, 420, 510],
          borderColor: '#3b82f6',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// ENHANCED PROJECT MANAGEMENT WITH EDIT & ANALYTICS
// ----------------------------------------------------
let comparisonChart = null;

function initProjectManager() {
  const form = document.getElementById('projectForm');
  const container = document.getElementById('projectCardsGrid');
  const searchInput = document.getElementById('projectSearch');
  if (!container) return;

  // Default Initial Data
  let defaultProjects = [
    { name: "Mahnoor's Cafe", traffic: 12500, category: "Web App" },
    { name: "SkillMap AI", traffic: 28400, category: "AI Tool" },
    { name: "Codify-vibe studio", traffic: 19800, category: "Web App" }
  ];

  let projects = JSON.parse(localStorage.getItem('dm_projects')) || defaultProjects;

  // Render Project Cards and Update Stats & Chart
  function renderProjects(filterText = '') {
    container.innerHTML = '';
    
    const filteredProjects = projects.filter(p => 
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.category.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredProjects.forEach((p, index) => {
      const realIndex = projects.indexOf(p);
      const card = document.createElement('div');
      card.className = 'kpi-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:#38bdf8; text-transform:uppercase; font-weight:bold;">${p.category}</span>
          <div style="display:flex; gap:10px;">
            <button onclick="openEditModal(${realIndex})" title="Edit Project" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:0.9rem;"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="removeProject(${realIndex})" title="Delete Project" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.9rem;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">${p.name}</h3>
        <p style="color:var(--text-muted); font-size:0.85rem; margin:0;">Monthly Traffic: <strong style="color:var(--text-main); font-size:1rem;">${Number(p.traffic).toLocaleString()}</strong></p>
        <div style="width:100%; background:rgba(255,255,255,0.1); height:6px; border-radius:3px; margin-top:12px; overflow:hidden;">
          <div style="width:${Math.min(100, (p.traffic / 50000) * 100)}%; background:linear-gradient(90deg, #10b981, #3b82f6); height:100%; border-radius:3px;"></div>
        </div>
      `;
      container.appendChild(card);
    });

    updateSummaryWidgets();
    updateComparisonChart();
  }

  // Update Top Stats Widgets
  function updateSummaryWidgets() {
    const totalProjEl = document.getElementById('totalProjectsCount');
    const combTrafficEl = document.getElementById('combinedTrafficCount');
    const topProjEl = document.getElementById('topProjectName');

    if (totalProjEl) totalProjEl.innerText = projects.length;

    const totalTraffic = projects.reduce((acc, curr) => acc + Number(curr.traffic), 0);
    if (combTrafficEl) combTrafficEl.innerText = totalTraffic.toLocaleString();

    if (projects.length > 0) {
      const topProj = [...projects].sort((a, b) => b.traffic - a.traffic)[0];
      if (topProjEl) topProjEl.innerText = topProj.name;
    } else {
      if (topProjEl) topProjEl.innerText = "-";
    }
  }

  // Render Bar Chart comparing all projects
  function updateComparisonChart() {
    const ctx = document.getElementById('projectComparisonChart');
    if (!ctx) return;

    const labels = projects.map(p => p.name);
    const data = projects.map(p => p.traffic);

    if (comparisonChart) {
      comparisonChart.destroy();
    }

    comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Visitors',
          data: data,
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Form Submit: Add New Project
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pName').value;
      const traffic = parseInt(document.getElementById('pTraffic').value);
      const category = document.getElementById('pCategory').value;

      projects.push({ name, traffic, category });
      localStorage.setItem('dm_projects', JSON.stringify(projects));
      renderProjects();
      form.reset();
    });
  }

  // Delete Project Function
  window.removeProject = function(i) {
    projects.splice(i, 1);
    localStorage.setItem('dm_projects', JSON.stringify(projects));
    renderProjects();
  };

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderProjects(e.target.value);
    });
  }

  // Edit Modal Controls
  window.openEditModal = function(index) {
    const modal = document.getElementById('editModal');
    const proj = projects[index];

    document.getElementById('editIndex').value = index;
    document.getElementById('editName').value = proj.name;
    document.getElementById('editTraffic').value = proj.traffic;
    document.getElementById('editCategory').value = proj.category;

    modal.style.display = 'flex';
  };

  window.closeEditModal = function() {
    document.getElementById('editModal').style.display = 'none';
  };

  // Edit Form Submit
  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = document.getElementById('editIndex').value;
      
      projects[idx] = {
        name: document.getElementById('editName').value,
        traffic: parseInt(document.getElementById('editTraffic').value),
        category: document.getElementById('editCategory').value
      };

      localStorage.setItem('dm_projects', JSON.stringify(projects));
      closeEditModal();
      renderProjects();
    });
  }

  renderProjects();
}

// Auto Initialize
document.addEventListener('DOMContentLoaded', () => {
  initProjectManager();
});

// ----------------------------------------------------
// DASHBOARD CHARTS INITIALIZATION
// ----------------------------------------------------
function initDashboardCharts() {
  // 1. Visitors Distribution Chart (Doughnut)
  const ctx1 = document.getElementById('visitorsDistributionChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Organic', 'Direct', 'Referral'],
        datasets: [{
          data: [55, 25, 20],
          backgroundColor: ['#06b6d4', '#ec4899', '#3b82f6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#9ca3af', font: { size: 12 } } }
        },
        cutout: '70%'
      }
    });
  }

  // 2. Visitors by Type Chart (Bar)
  const ctx2 = document.getElementById('visitorsTypeChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['New', 'Returning', 'Members'],
        datasets: [{
          label: 'Visitors',
          data: [650, 480, 210],
          backgroundColor: ['#3b82f6', '#a855f7', '#10b981'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Traffic History Over Time Chart (Line)
  const ctx3 = document.getElementById('trafficHistoryChart');
  if (ctx3) {
    new Chart(ctx3, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Traffic Growth',
          data: [12000, 19000, 15000, 25000, 22000, 30000, 35000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

// Render Dashboard Charts on Page Load
document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
});



// ----------------------------------------------------
// REPORTS EXPORT TRIGGER NOTIFICATION
// ----------------------------------------------------
function triggerExport(type) {
  alert(`Downloading ${type} report... Your file is being generated.`);
}

// ----------------------------------------------------
// SETTINGS PAGE CONTROLS
// ----------------------------------------------------
function toggleKey() {
  const keyInput = document.getElementById('apiKey');
  const icon = document.getElementById('eyeIcon');
  if (keyInput && icon) {
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      keyInput.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  }
}

const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('System preferences saved successfully!');
  });
}


// ----------------------------------------------------
// ANALYTICS PAGE CHARTS INITIALIZATION
// ----------------------------------------------------
function initAnalyticsCharts() {
  // 1. Realtime Throughput Line Chart
  const ctx1 = document.getElementById('throughputChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [{
          label: 'Requests / Sec',
          data: [1420, 1100, 1890, 3200, 4800, 4100, 5600, 4300],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#38bdf8',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
        }
      }
    });
  }

  // 2. Endpoint Latency Horizontal Bar Chart
  const ctx2 = document.getElementById('endpointChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['/api/v1/auth', '/api/v1/query', '/api/v2/metrics', '/api/v1/export'],
        datasets: [{
          label: 'Latency (ms)',
          data: [12, 45, 28, 85],
          backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Traffic Resource Allocation Polar Area Chart
  const ctx3 = document.getElementById('allocationChart');
  if (ctx3) {
    new Chart(ctx3, {
      type: 'polarArea',
      data: {
        labels: ['REST API', 'GraphQL', 'WebSockets', 'Static Assets'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(236, 72, 153, 0.7)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#9ca3af', font: { size: 11 } } }
        },
        scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } }
      }
    });
  }
}

// Render Analytics Charts on Load
document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsCharts();
});
// ----------------------------------------------------
// ACTIVE VISITORS DISTRIBUTION DOUGHNUT CHART
// ----------------------------------------------------
function initVisitorDistributionChart() {
  const ctx = document.getElementById('visitorDistributionChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Organic Search', 'Direct Traffic', 'Social Media', 'Referral Links'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: [
            '#3b82f6', // Bright Blue
            '#10b981', // Emerald Green
            '#8b5cf6', // Purple
            '#f59e0b'  // Amber
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#9ca3af',
              font: { size: 11 },
              padding: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }
}

// Chart render invoke
document.addEventListener('DOMContentLoaded', () => {
  initVisitorDistributionChart();
});


function initVisitorDistributionChart() {
  const ctx = document.getElementById('visitorDistributionChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Organic Search', 'Direct Traffic', 'Social Media', 'Referral Links'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#8b5cf6',
            '#f59e0b'
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#9ca3af',
              font: { 
                size: 10.5,
                family: 'inherit'
              },
              padding: 15,
              boxWidth: 10,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }
}