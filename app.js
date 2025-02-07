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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas antes de redesenhar

    // Desenha os quadrados de fundo
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * squareSize;
            let y = row * squareSize;
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x, y, squareSize, squareSize);
        }
    }

    // Criar linhas cinzas (linhas finas primeiro)
    ctx.lineWidth = 1; // Garante que as linhas finas tenham sempre 1px de espessura
    for (let i = 0; i < rows * 4; i++) {
        if (i % 4 !== 0) { 
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(0, i * (squareSize / 4));
            ctx.lineTo(canvas.width, i * (squareSize / 4));
            ctx.stroke();
        }
    }

    for (let j = 0; j < cols * 4; j++) {
        if (j % 4 !== 0) { 
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(j * (squareSize / 4), 0);
            ctx.lineTo(j * (squareSize / 4), canvas.height);
            ctx.stroke();
        }
    }

    // Criar linhas pretas (linhas grossas depois)
    ctx.lineWidth = 2; // Define explicitamente a espessura das linhas grossas
    for (let i = 0; i < rows * 4; i++) {
        if (i % 4 === 0) {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(0, i * (squareSize / 4));
            ctx.lineTo(canvas.width, i * (squareSize / 4));
            ctx.stroke();
        }
    }

    for (let j = 0; j < cols * 4; j++) {
        if (j % 4 === 0) {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(j * (squareSize / 4), 0);
            ctx.lineTo(j * (squareSize / 4), canvas.height);
            ctx.stroke();
        }
    }

    // Criar círculos
    ctx.lineWidth = 1; // Reseta a espessura para os círculos
    for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols - 1; col++) {
            let x = (col + 1) * squareSize;
            let y = (row + 1) * squareSize;
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Primeira chamada
drawTable();




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
