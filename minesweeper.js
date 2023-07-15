const size = 10;
const mines = 20;
const mineLocations = new Set();
const cellElements = [];
while (mineLocations.size < mines) {
    mineLocations.add(Math.floor(Math.random() * size * size));
}

const grid = document.getElementById('grid');
for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'unknown');
    let timerId = null;
    
    cell.addEventListener('touchstart', (e) => {
        e.preventDefault();
        timerId = setTimeout(() => {
            toggleFlag(cell, i);
        }, 500);
    }, false);

    cell.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (timerId !== null) {
            clearTimeout(timerId);
            revealCell(cell, i);
        }
    }, false);

    cell.addEventListener('click', () => {
        if (cell.classList.contains('flag')) {
            return;
        }
        revealCell(cell, i);
    });

    cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(cell, i);
    });

    grid.appendChild(cell);
    cellElements.push(cell);
}

function revealCell(cell, i) {
    if (cell.classList.contains('flag') || cell.classList.contains('safe')) {
        return;
    }
    if (mineLocations.has(i)) {
        cell.classList.remove('unknown');
        cell.classList.add('mine');
        cell.textContent = '💣';
        alert('Game Over');
    } else {
        let mineCount = 0;
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const ni = i + dx + dy * size;
                if (ni >= 0 && ni < size * size && ((i % size) + dx >= 0) && ((i % size) + dx < size)) {
                    if (mineLocations.has(ni)) {
                        mineCount++;
                    } else {
                        neighbors.push(ni);
                    }
                }
            }
        }
        cell.classList.remove('unknown');
        cell.classList.add('safe');
        cell.textContent = mineCount > 0 ? mineCount : '';
        if (mineCount === 0) {
            // flood fill
            for (let ni of neighbors) {
                revealCell(cellElements[ni], ni);
            }
        }
    }
}

function toggleFlag(cell, i) {
    if (cell.classList.contains('unknown')) {
        cell.classList.remove('unknown');
        cell.classList.add('flag');
        cell.textContent = '🚩';
    } else if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.classList.add('unknown');
        cell.textContent = '';
    }
}
