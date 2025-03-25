const holePars = [4, 3, 2, 4, 3, 1, 4, 3, 2, 4, 3, 1]; // 12 holes (6 × 2)
let rounds = JSON.parse(localStorage.getItem('rounds')) || [];

// Populate table
function loadHoles() {
    const table = document.getElementById('hole-table');
    table.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Hole ${i + 1}</td>
            <td>${holePars[i]}</td>
            <td><input type="number" min="0" max="5" value="0" id="putts-${i}"></td>
            <td id="score-${i}">-</td>
        `;
        table.appendChild(row);
        document.getElementById(`putts-${i}`).addEventListener('input', updateScores);
    }
    updateScores();
}
loadHoles();

// Calculate scores
function updateScores() {
    let total = 0;
    for (let i = 0; i < 12; i++) {
        const putts = parseInt(document.getElementById(`putts-${i}`).value) || 0;
        const par = holePars[i];
        const diff = putts - par;
        const score = diff === 0 ? 'E' : (diff > 0 ? `+${diff}` : diff);
        document.getElementById(`score-${i}`).textContent = score;
        total += diff;
    }
    document.getElementById('total-score').textContent = total;
}

// Save round and update chart
function saveRound() {
    const round = {
        date: new Date().toLocaleDateString(),
        scores: Array.from({ length: 12 }, (_, i) => parseInt(document.getElementById(`putts-${i}`).value) || 0),
        total: parseInt(document.getElementById('total-score').textContent)
    };
    rounds.push(round);
    localStorage.setItem('rounds', JSON.stringify(rounds));
    loadHoles(); // Reset inputs
    updateChart();
}

// Chart setup
const ctx = document.getElementById('scoreChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Total Score',
            data: [],
            borderColor: '#4CAF50',
            fill: false
        }]
    },
    options: { scales: { y: { beginAtZero: false } } }
});

function updateChart() {
    chart.data.labels = rounds.map(r => r.date);
    chart.data.datasets[0].data = rounds.map(r => r.total);
    chart.update();
}
updateChart();