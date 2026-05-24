// script.js

// Game State
let state = {
    score: 0,
    clickPower: 1,
    autoPower: 0,
    costClick: 10,
    costAuto: 50
};

// DOM Elements
const elScore = document.getElementById('score');
const elPps = document.getElementById('pps');
const btnTap = document.getElementById('tap-button');
const btnUpgradeClick = document.getElementById('upgrade-click');
const btnUpgradeAuto = document.getElementById('upgrade-auto');
const elCostClick = document.getElementById('cost-click');
const elCostAuto = document.getElementById('cost-auto');
const btnReset = document.getElementById('reset-button');

// Load State from LocalStorage
function loadState() {
    const savedState = localStorage.getItem('idleTapperState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('idleTapperState', JSON.stringify(state));
}

// Initialize Game
function init() {
    loadState();
    updateUI();
    // Start auto-tapper loop
    setInterval(autoClick, 1000);
    
    // Save state periodically (every 5 seconds) just in case
    setInterval(saveState, 5000);
}

// Update UI
function updateUI() {
    elScore.innerText = Math.floor(state.score);
    elPps.innerText = state.autoPower;
    
    elCostClick.innerText = state.costClick;
    elCostAuto.innerText = state.costAuto;

    // Button states
    btnUpgradeClick.disabled = state.score < state.costClick;
    btnUpgradeAuto.disabled = state.score < state.costAuto;
}

// Tap Action
bnTap.addEventListener('click', () => {
    state.score += state.clickPower;
    updateUI();
    saveState();
});

// Auto Click Action
function autoClick() {
    if (state.autoPower > 0) {
        state.score += state.autoPower;
        updateUI();
    }
}

// Upgrade Click Power
btnUpgradeClick.addEventListener('click', () => {
    if (state.score >= state.costClick) {
        state.score -= state.costClick;
        state.clickPower += 1;
        state.costClick = Math.floor(state.costClick * 1.5); // Increase cost
        updateUI();
        saveState();
    }
});

// Upgrade Auto Power
btnUpgradeAuto.addEventListener('click', () => {
    if (state.score >= state.costAuto) {
        state.score -= state.costAuto;
        state.autoPower += 1;
        state.costAuto = Math.floor(state.costAuto * 1.5); // Increase cost
        updateUI();
        saveState();
    }
});

// Reset Game
btnReset.addEventListener('click', () => {
    if(confirm("Sei sicuro di voler resettare tutti i progressi?")) {
        state = {
            score: 0,
            clickPower: 1,
            autoPower: 0,
            costClick: 10,
            costAuto: 50
        };
        updateUI();
        saveState();
    }
});

// Start the game
init();