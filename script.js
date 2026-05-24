// script.js

// Game State
let state = {
    score: 0,
    grid: Array(16).fill(null) // 4x4 grid
};

let selectedCellIndex = null;

// Monsters (Levels 1 to 9)
const monsters = ['🥚', '🐥', '🦉', '🐢', '🦖', '🐉', '👾', '👽', '👻'];
const MAX_LEVEL = monsters.length - 1;

// DOM Elements
const elGrid = document.getElementById('grid');
const elScore = document.getElementById('score');
const btnSpawn = document.getElementById('spawn-button');
const btnReset = document.getElementById('reset-button');

// Load State from LocalStorage
function loadState() {
    const savedState = localStorage.getItem('mergeMonstersState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('mergeMonstersState', JSON.stringify(state));
}

// Initialize Game
function init() {
    loadState();
    createGridDOM();
    updateUI();
}

// Create Grid DOM elements
function createGridDOM() {
    elGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        elGrid.appendChild(cell);
    }
}

// Update the visual representation of the grid and score
function updateUI(mergedIndex = -1) {
    elScore.innerText = state.score;
    
    const cells = document.querySelectorAll('.cell');
    let emptyCount = 0;

    for (let i = 0; i < 16; i++) {
        const cell = cells[i];
        cell.innerHTML = '';
        cell.className = 'cell'; // reset classes

        if (state.grid[i] !== null) {
            const level = state.grid[i];
            const span = document.createElement('span');
            span.className = 'monster';
            span.innerText = monsters[level];
            
            // Add animation class if it just merged
            if (i === mergedIndex) {
                span.classList.add('merge');
            }
            
            cell.appendChild(span);
        } else {
            emptyCount++;
        }

        if (i === selectedCellIndex) {
            cell.classList.add('selected');
        }
    }

    // Disable spawn button if grid is full
    btnSpawn.disabled = emptyCount === 0;
}

// Handle cell clicks for moving and merging
function handleCellClick(index) {
    if (selectedCellIndex === null) {
        // First click: Select a monster
        if (state.grid[index] !== null) {
            selectedCellIndex = index;
            updateUI();
        }
    } else {
        // Second click: Move or Merge or Deselect
        if (index === selectedCellIndex) {
            // Clicked same cell, deselect
            selectedCellIndex = null;
            updateUI();
        } else if (state.grid[index] === null) {
            // Clicked empty cell, move
            state.grid[index] = state.grid[selectedCellIndex];
            state.grid[selectedCellIndex] = null;
            selectedCellIndex = null;
            updateUI();
            saveState();
        } else if (state.grid[index] === state.grid[selectedCellIndex]) {
            // Clicked same level monster, MERGE!
            const currentLevel = state.grid[index];
            if (currentLevel < MAX_LEVEL) {
                state.grid[index] = currentLevel + 1;
                state.grid[selectedCellIndex] = null;
                
                // Score = 10 * newLevel
                state.score += (currentLevel + 1) * 10; 
                
                selectedCellIndex = null;
                updateUI(index); // pass index to trigger animation
                saveState();
            } else {
                // Max level reached, just deselect
                selectedCellIndex = null;
                updateUI();
            }
        } else {
            // Clicked different monster, select the new one
            selectedCellIndex = index;
            updateUI();
        }
    }
}

// Spawn a Level 0 monster in a random empty cell
btnSpawn.addEventListener('click', () => {
    const emptyIndices = [];
    for (let i = 0; i < 16; i++) {
        if (state.grid[i] === null) {
            emptyIndices.push(i);
        }
    }

    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        state.grid[randomIndex] = 0; // Spawn Level 0 ('🥚')
        state.score += 5; // Small bonus for spawning
        
        // Deselect if active
        selectedCellIndex = null;
        updateUI();
        saveState();
    }
});

// Reset Game
btnReset.addEventListener('click', () => {
    if(confirm("Sei sicuro di voler resettare tutti i mostriciattoli?")) {
        state = {
            score: 0,
            grid: Array(16).fill(null)
        };
        selectedCellIndex = null;
        updateUI();
        saveState();
    }
});

init();
