const markedSign = '✔️';

// Function to increase saturation by 30%
function increaseSaturation(hex, percent) {
    const rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const max = Math.max(...rgb);
    const factor = (max + (255 - max) * percent / 100) / max;
    return `#${rgb.map(x => Math.min(255, Math.round(x * factor)).toString(16).padStart(2, '0')).join('')}`;
}

//const colors = ['#AECBFA', '#F8C8DC', '#FFF9C4', '#C8E6C9', '#FFE0B2', '#FFCDD2'].map(color => increaseSaturation(color, 70));
const colors = ['#FEA444', '#FF7FAF', '#8AEE8C', '#669CFE', '#FFE249'];
console.log(colors);
const grid = document.querySelector('.grid');
const headers = grid.querySelectorAll('.header');
let editMode = false;
let currentColor = null;

const cells_colors = ["2","2","2","4","4","4","4","2","3","3","3","0","4","4","4","0","2","4","2","4","4","0","0","1","3","3","0","0","2","2","3","2","1","2","2","2","2","1","1","1","4","4","0","2","2","3","1","1","2","0","0","3","3","2","2","4","4","0","1","3","1","0","0","0","0","1","3","3","0","0","0","1","1","1","1","1","3","3","1","1","1","1","4","4","0","1","3","3","3","0","4","4","3","3","3","3","1","4","4","4","2","2","2","0","0"];

// Create color palette
const palette = document.createElement('div');
palette.className = 'palette';
palette.style.display = 'none'; // Initially hide the palette

palette.style.padding = '10px';
palette.style.backgroundColor = '#fff';
palette.style.border = '1px solid #ccc';
palette.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

colors.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color';
   // colorDiv.style.width = '30px';
    colorDiv.style.height = '30px';
    colorDiv.style.margin = '5px 0'; // Adjust margin for vertical alignment
    colorDiv.style.display = 'block'; // Change to block for vertical alignment
    colorDiv.style.backgroundColor = color;
    colorDiv.addEventListener('click', () => {
        currentColor = color;
    });
    palette.appendChild(colorDiv);
});
const sidebar = document.querySelector('.sidebar');
sidebar.appendChild(palette);

// Create dump button
const dumpButton = document.createElement('button');
dumpButton.textContent = 'Dump Colors';
dumpButton.style.display = 'none'; // Initially hide the button
dumpButton.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell:not(.header)');
    const colorIndices = Array.from(cells).map(cell => cell.dataset.colorIndex);
    console.log(JSON.stringify(colorIndices));
});
sidebar.appendChild(dumpButton);

// Create star button
const starButton = document.createElement('button');
starButton.textContent = 'Dump Starred Cells';
starButton.style.display = 'none'; // Initially hide the button
starButton.addEventListener('click', () => {
    const starredCells = Array.from(document.querySelectorAll('.cell.gp.starred'));
    const starredIndices = starredCells.map(cell => ({
        columnId: cell.dataset.columnId,
        rowId: cell.dataset.rowId
    }));
    console.log(JSON.stringify(starredIndices));
});
sidebar.appendChild(starButton);

// Toggle edit mode
document.querySelector('#editModeToggle').addEventListener('click', () => {
    editMode = !editMode;
    palette.style.display = editMode ? 'block' : 'none';
    dumpButton.style.display = editMode ? 'block' : 'none'; // Show/hide dump button
    starButton.style.display = editMode ? 'block' : 'none'; // Show/hide star button
});

let cellCounter = -8; // Initialize a counter for cells
let columnIndex=0;
let rowIndex=0;
headers.forEach((header, headerIndex) => {
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell gp';
        // Use the cells_colors array for the cell background color
        const colorIndex = headerIndex * 7 + i;
        const color = colors[cells_colors[colorIndex]];
        cell.style.backgroundColor = color;
        cell.dataset.colorIndex = colors.indexOf(color); // Store the color index in a data attribute
        cell.dataset.headerIndex = headerIndex; // Store the header index in a data attribute
        cell.dataset.columnId = columnIndex; // Store the header index in a data attribute
        cell.dataset.rowId = rowIndex; // Store the header index in a data attribute
        cell.style.cursor = 'pointer';
        cell.style.userSelect = 'none';
        //cell.textContent = columnIndex;
        cellCounter++;
        // Highlight cells in the H column (assuming H column is the 8th column, index 7)
        if (cellCounter % 15 === 0) {
            cell.classList.add('highlight');
        }

        columnIndex++;
        if(columnIndex % 15 === 0 && columnIndex !== 0){
            columnIndex=0;
            rowIndex++;
        }
        grid.appendChild(cell);

        // Add click event listener for edit mode
        cell.addEventListener('click', () => {
            if (editMode && currentColor) {
                cell.style.backgroundColor = currentColor;
                cell.dataset.colorIndex = colors.indexOf(currentColor); // Update the color index
            } else
            {
                cell.textContent = cell.textContent === markedSign ? '' : markedSign;
                checkPoints();
            }
        });

        // Add double-click event listener for star mode
        cell.addEventListener('dblclick', () => {
            if (editMode) {
                cell.classList.toggle('starred');
            }
        });
    }
});
addStars();

const bonusItems = document.querySelectorAll('.bonus-item');
bonusItems.forEach((item, index) => {
    item.style.backgroundColor = colors[index % colors.length];
    item.addEventListener('click', () => {
        //item.style.border = '3px solid red'; // Add border on click
    });
});

const points = '533322212223335';
const pointsRow = document.createElement('div');


for (let i = 0; i < points.length; i++) {
    const pointCell = document.createElement('div');
    pointCell.className = 'cell header points';
    pointCell.textContent = points[i];
    pointCell.dataset.columnId = i;
    grid.appendChild(pointCell);
}

function checkPoints(){
    const columns = 15; // Assuming there are 15 columns
    for (let col = 0; col < columns; col++) {
        let allMarked = true;
        for (let i = 0; i < grid.children.length; i++) {
            const cell = grid.children[i];
            if (cell.classList.contains('gp') && cell.dataset.columnId == col && cell.textContent !== markedSign) {
                allMarked = false;
                break;
            }
        }
        if (allMarked) {
            for (let i = 0; i < grid.children.length; i++) {
                const cell = grid.children[i];
                if (cell.classList.contains('points') && cell.dataset.columnId == col) {
                    cell.classList.add('marked');
                }
            }
        }
    }

    const bonusItems = document.querySelectorAll('.bonus-item');
    bonusItems.forEach((item, index) => {
        const color = colors[index % colors.length];
        let allMarked = true;
        for (let i = 0; i < grid.children.length; i++) {
            const cell = grid.children[i];
            if (!cell.classList.contains('gp')) continue;
            if (cell.dataset.colorIndex == index && cell.textContent !== markedSign) {
                allMarked = false;
                break;
            }
        }
        if (allMarked) {
            item.classList.add('marked');
        } else{
            item.classList.remove('marked');
        }
    });
}

function addStars(){
    const starredCells = [{"columnId":"7","rowId":"0"},{"columnId":"11","rowId":"0"},{"columnId":"2","rowId":"1"},{"columnId":"4","rowId":"1"},{"columnId":"9","rowId":"1"},{"columnId":"0","rowId":"2"},{"columnId":"5","rowId":"3"},{"columnId":"13","rowId":"3"},{"columnId":"1","rowId":"5"},{"columnId":"3","rowId":"5"},{"columnId":"8","rowId":"5"},{"columnId":"10","rowId":"5"},{"columnId":"14","rowId":"5"},{"columnId":"12","rowId":"6"}];
    
    const cells = document.querySelectorAll('.cell.gp');
    cells.forEach(cell => {
        const columnId = cell.dataset.columnId;
        const rowId = cell.dataset.rowId;
        starredCells.forEach(star => {
            if (star.columnId === columnId && star.rowId === rowId) {
                cell.classList.add('starred');
            }
        });
    });
}

document.getElementById('rollDiceButton').addEventListener('click', () => {
    const diceResultElement = document.getElementById('diceResult');
    diceResultElement.textContent = ''; // Clear current result

    const diceFaces = [1, 2, 3, 4, 5, '⭐'];
    const colorFaces = ['🔵', '🔴', '🟠', '🟡', '🟢', '🌈'];

    const rollDice = (faces) => faces[Math.floor(Math.random() * faces.length)];

    const results = [];
    for (let i = 0; i < 2; i++) {
        results.push(rollDice(diceFaces));
        results.push(rollDice(colorFaces));
    }

    diceResultElement.textContent = results.join(' ');
});