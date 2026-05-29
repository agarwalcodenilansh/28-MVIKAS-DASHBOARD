Chart.defaults.color = '#475569';
Chart.defaults.font.family = 'Inter, system-ui, -apple-system, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
Chart.defaults.plugins.tooltip.borderColor = '#1e293b';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.scale.grid.color = '#e2e8f0';
Chart.defaults.scale.ticks.color = '#475569';

function switchTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
}

// Expose switchTab globally
window.switchTab = switchTab;

const clients = [
  { name: 'Carrier Refrigeration', target: 300000, achieved: 182628, activeDays: 21 },
  { name: 'Carrier CTD', target: 70362, achieved: 37165, activeDays: 14 },
  { name: 'Mitras Technocrafts', target: 10000, achieved: 17847, activeDays: 8 },
  { name: 'Haier CCR', target: 55000, achieved: 23818, activeDays: 21 },
  { name: 'Bombax (HYD)', target: 85111, achieved: 83264, activeDays: 22 },
  { name: 'Kumar Services', target: 4000, achieved: 11033, activeDays: 9 },
  { name: 'Sukuga Tech', target: 17000, achieved: 12618, activeDays: 9 },
  { name: 'Cosmos Pumps', target: 20000, achieved: 13395, activeDays: 7 },
  { name: 'Loom Solar', target: 120000, achieved: 10140, activeDays: 4 },
  { name: 'Oneiric Appliances', target: 32876, achieved: 8200, activeDays: 5 },
  { name: 'Edusoft Healthcare', target: 10000, achieved: 536, activeDays: 3 },
  { name: 'Grover Innovations', target: 10000, achieved: 750, activeDays: 2 },
  { name: 'Aurinko Healthcare', target: 1047, achieved: 348, activeDays: 1 },
];

clients.forEach(c => {
  c.pct = Math.round(c.achieved / c.target * 100);
  c.avgDay = c.activeDays > 0 ? Math.round(c.achieved / c.activeDays) : 0;
  c.remaining = Math.max(c.target - c.achieved, 0);
  c.daysNeeded = c.avgDay > 0 ? Math.round(c.remaining / c.avgDay) : 999;
});

// 1. Status Donut Chart
new Chart(document.getElementById('statusDonut'), {
  type: 'doughnut',
  data: {
    labels: ['Delayed', 'Open (in transit)', 'Due tomorrow', 'Booked yesterday'],
    datasets: [{
      data: [188, 301, 63, 107],
      backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed/659*100)}%)` } }
    }
  }
});

// 2. Due Tomorrow Orders Chart
const dueLabels = ['Bombax','Paramount Surgimed','Carrier Refrig.','Haier CCR','Sukuga','MITRAS','Cosmos Pumps'];
const dueData = [38, 8, 7, 4, 3, 2, 1];
new Chart(document.getElementById('dueTmrChart'), {
  type: 'bar',
  data: {
    labels: dueLabels,
    datasets: [{
      label: 'Orders due tomorrow',
      data: dueData,
      backgroundColor: 'rgba(0, 77, 245, 0.12)',
      borderColor: '#004df5',
      borderWidth: 1.5,
      borderRadius: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { autoSkip: false, maxRotation: 35, minRotation: 0, font: { size: 11, weight: '500' } }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 5 } }
    }
  }
});

// 3. Tonnage achieved vs monthly target
const barsEl = document.getElementById('tonnage-bars');
clients.forEach(c => {
  const gradient = c.pct >= 100 ? 'linear-gradient(90deg, #059669, #10b981)' : c.pct >= 60 ? 'linear-gradient(90deg, #d97706, #fbbf24)' : 'linear-gradient(90deg, #dc2626, #ef4444)';
  const pctCapped = Math.min(c.pct, 100);
  
  barsEl.innerHTML += `<div class="client-row">
    <div class="client-name" title="${c.name}">${c.name}</div>
    <div class="prog-bar-wrap">
      <div class="prog-bar" style="width:${pctCapped}%; background:${gradient}"></div>
    </div>
    <div class="pct-text">${c.pct}%</div>
    <div class="client-tonnage">${(c.achieved/1000).toFixed(1)}T / ${(c.target/1000).toFixed(0)}T</div>
  </div>`;
});

const topClients = clients.slice(0, 8);
const chartFont = { size: 11, weight: '500' };

// 4. Target Distribution Chart
new Chart(document.getElementById('targetChart'), {
  type: 'bar',
  data: {
    labels: topClients.map(c => c.name),
    datasets: [{
      label: 'Monthly target (kg)',
      data: topClients.map(c => c.target),
      backgroundColor: 'rgba(0, 77, 245, 0.12)',
      borderColor: '#004df5',
      borderWidth: 1.5,
      borderRadius: 4
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { callback: v => (v/1000).toFixed(0)+'k', font: chartFont } },
      y: { ticks: { font: chartFont }, grid: { display: false } }
    }
  }
});

// 5. Achieved vs Target Comparison Chart
new Chart(document.getElementById('achChart'), {
  type: 'bar',
  data: {
    labels: topClients.map(c => c.name),
    datasets: [
      {
        label: 'Achieved (kg)',
        data: topClients.map(c => c.achieved),
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderRadius: 4
      },
      {
        label: 'Target (kg)',
        data: topClients.map(c => c.target),
        backgroundColor: 'rgba(71, 85, 105, 0.08)',
        borderColor: '#475569',
        borderWidth: 1.5,
        borderRadius: 4
      }
    ]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 16, font: chartFont, color: '#475569' }
      }
    },
    scales: {
      x: { beginAtZero: true, ticks: { callback: v => (v/1000).toFixed(0)+'k', font: chartFont } },
      y: { ticks: { font: chartFont }, grid: { display: false } }
    }
  }
});

// 6. Daily Average Dispatched Chart
const tbody = document.getElementById('daily-table-body');
clients.forEach(c => {
  const pctColor = c.pct >= 100 ? '#059669' : c.pct >= 60 ? '#d97706' : '#dc2626';
  const dayColor = c.daysNeeded <= 3 ? '#059669' : c.daysNeeded <= 10 ? '#d97706' : '#dc2626';
  const daysText = c.remaining === 0 ? '✓ Done' : c.daysNeeded === 999 ? 'N/A' : c.daysNeeded;
  
  tbody.innerHTML += `<tr>
    <td style="font-weight:600">${c.name}</td>
    <td>${c.target.toLocaleString('en-IN')}</td>
    <td>${c.achieved.toLocaleString('en-IN')}</td>
    <td style="color:${pctColor}; font-weight:700">${c.pct}%</td>
    <td>${c.avgDay.toLocaleString('en-IN')}</td>
    <td>${c.remaining.toLocaleString('en-IN')}</td>
    <td style="color:${dayColor}; font-weight:700">${daysText}</td>
  </tr>`;
});

const top8avg = clients.slice(0, 8);
new Chart(document.getElementById('avgDayChart'), {
  type: 'bar',
  data: {
    labels: top8avg.map(c => c.name),
    datasets: [{
      label: 'Avg kg/day',
      data: top8avg.map(c => c.avgDay),
      backgroundColor: 'rgba(99, 102, 241, 0.12)',
      borderColor: '#6366f1',
      borderWidth: 1.5,
      borderRadius: 4
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { callback: v => v.toLocaleString('en-IN'), font: chartFont } },
      y: { ticks: { font: chartFont }, grid: { display: false } }
    }
  }
});

// 7. Days to Complete Target Chart
const daysColors = clients.map(c => c.daysNeeded <= 3 ? 'rgba(16, 185, 129, 0.12)' : c.daysNeeded <= 10 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)');
const daysBorderColors = clients.map(c => c.daysNeeded <= 3 ? '#10b981' : c.daysNeeded <= 10 ? '#f59e0b' : '#ef4444');
const daysData2 = clients.map(c => c.remaining === 0 ? 0 : c.daysNeeded === 999 ? 0 : c.daysNeeded);

new Chart(document.getElementById('daysChart'), {
  type: 'bar',
  data: {
    labels: clients.map(c => c.name),
    datasets: [{
      label: 'Days to complete',
      data: daysData2,
      backgroundColor: daysColors,
      borderColor: daysBorderColors,
      borderWidth: 1.5,
      borderRadius: 4
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { font: chartFont } },
      y: { ticks: { font: chartFont }, grid: { display: false } }
    }
  }
});
