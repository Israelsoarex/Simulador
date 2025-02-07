let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Definindo o tamanho do canvas
if (window.innerWidth >= 768) {
    canvas.width = window.innerWidth;
} else {
    canvas.width = window.innerWidth * 4;
}

const horizontal = canvas.width;

// Definindo as dimensões do tabuleiro
const rows = 8;
const cols = 12;
const squareSize = horizontal / cols;
const unidade = squareSize / 4;
canvas.height = squareSize * 8;

// Posição inicial do painel solar
let panelX = unidade;
let panelY = unidade;

// Desenha o tabuleiro
function drawTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Apagar tudo
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * squareSize;
            let y = row * squareSize;
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x, y, squareSize, squareSize);
        }
    }

    for (let i = 0; i < rows * 4; i++) {
        ctx.strokeStyle = (i % 4 === 0) ? '#000' : '#ccc';
        ctx.beginPath();
        ctx.moveTo(0, i * unidade);
        ctx.lineTo(canvas.width, i * unidade);
        ctx.stroke();
    }

    for (let j = 0; j < cols * 4; j++) {
        ctx.strokeStyle = (j % 4 === 0) ? '#000' : '#ccc';
        ctx.beginPath();
        ctx.moveTo(j * unidade, 0);
        ctx.lineTo(j * unidade, canvas.height);
        ctx.stroke();
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

function drawSolarPanel(ctx, x, y, width, height, rows, cols) {
    drawRoundedRect(ctx, x - 4, y - 4, width + 16, height + 16, 15, '#ccc', '#000', 3);
    let cellWidth = width / cols;
    let cellHeight = height / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cellX = x + col * cellWidth + 4;
            let cellY = y + row * cellHeight + 4;
            ctx.fillStyle = '#043E7D';
            ctx.fillRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
        }
    }
}

// Verifica se o clique foi dentro do painel solar
function isInsidePanel(x, y) {
    return x >= panelX && x <= panelX + 12 * unidade && y >= panelY && y <= panelY + 8 * unidade;
}

// Variáveis de controle de arrasto
let dragging = false;
let startX, startY;

// Evento para iniciar o arrasto
canvas.addEventListener('mousedown', function(e) {
    if (isInsidePanel(e.offsetX, e.offsetY)) {
        dragging = true;
        startX = e.offsetX - panelX;
        startY = e.offsetY - panelY;
    }
});

// Evento para atualizar a posição enquanto arrasta
canvas.addEventListener('mousemove', function(e) {
    if (dragging) {
        panelX = e.offsetX - startX;
        panelY = e.offsetY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTable();
        drawSolarPanel(ctx, panelX, panelY, 12 * unidade, 8 * unidade, 4, 6);
    }
});

// Evento para parar o arrasto
canvas.addEventListener('mouseup', function() {
    dragging = false;
});

// Inicializa o desenho
drawTable();
drawSolarPanel(ctx, panelX, panelY, 12 * unidade, 8 * unidade, 4, 6);
