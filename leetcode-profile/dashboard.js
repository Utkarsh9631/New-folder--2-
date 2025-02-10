// filepath: /leetcode-profile/script.js
// Heatmap Data - Store attempted quiz dates with count
const activityData = new Map(JSON.parse(localStorage.getItem('activityData')) || []);

// Populate Heatmap
function initializeHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;

    try {
        heatmap.innerHTML = '';
        
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 11);
        startDate.setDate(1);

        const heatmapWrapper = document.createElement("div");
        heatmapWrapper.className = "heatmap-wrapper";

        const monthsContainer = document.createElement("div");
        monthsContainer.className = "months-container";

        // Create month sections first
        const months = {};
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const monthKey = currentDate.toLocaleString('default', { month: 'short' });
            
            if (!months[monthKey]) {
                const monthSection = document.createElement("div");
                monthSection.className = "month-section";
                
                const monthLabel = document.createElement("div");
                monthLabel.className = "month-label";
                monthLabel.textContent = monthKey;
                monthSection.appendChild(monthLabel);
                
                const monthGrid = document.createElement("div");
                monthGrid.className = "month-grid";
                monthSection.appendChild(monthGrid);
                
                months[monthKey] = monthGrid;
                monthsContainer.appendChild(monthSection);
            }

            const cell = document.createElement("div");
            const dateStr = currentDate.toISOString().split('T')[0];
            
            cell.className = "contribution-cell";
            cell.setAttribute('data-date', dateStr);
            
            const activityCount = activityData.get(dateStr) || 0;
            if (activityCount > 0) {
                cell.classList.add("active");
                cell.classList.add(`level-${Math.min(4, Math.ceil(activityCount/2))}`);
            }

            const formattedDate = currentDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            cell.title = `${activityCount} contributions on ${formattedDate}`;

            months[monthKey].appendChild(cell);
            
            currentDate.setDate(currentDate.getDate() + 1);
        }

        heatmapWrapper.appendChild(monthsContainer);
        
        // Add legend
        const legend = document.createElement("div");
        legend.className = "heatmap-legend";
        legend.innerHTML = `
            <span>Less</span>
            <div class="legend-squares">
                <div class="legend-item"></div>
                <div class="legend-item level-1"></div>
                <div class="legend-item level-2"></div>
                <div class="legend-item level-3"></div>
                <div class="legend-item level-4"></div>
            </div>
            <span>More</span>
        `;
        
        heatmapWrapper.appendChild(legend);
        heatmap.appendChild(heatmapWrapper);

    } catch (error) {
        console.error("Error initializing heatmap:", error);
    }
}

function updateCellColor(cell, count) {
    cell.classList.remove("level-1", "level-2", "level-3", "level-4");
    cell.classList.add("active");
    cell.classList.add(`level-${Math.min(4, Math.ceil(count/2))}`);
}

// Function to calculate and update streak
function updateStreak() {
    let streak = 0;
    const today = new Date();
    let currentDate = new Date();

    while (activityData.has(currentDate.toISOString().split('T')[0])) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    document.getElementById("streak").textContent = `Streak: ${streak} days`;
}

// Initialize heatmap when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeHeatmap();
    updateStreak();
});

// Update User Info
document.getElementById("username").textContent = "Guest";

// Add event listener for storage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'activityData') {
        // Update activityData from localStorage
        activityData.clear();
        const storedData = JSON.parse(e.newValue) || [];
        storedData.forEach(([key, value]) => activityData.set(key, value));
        
        // Refresh the heatmap
        initializeHeatmap();
        updateStreak();
    }
});