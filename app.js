let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Definindo o tamanho do canvas
if (window.innerWidth >= 768) { // 
    canvas.width = window.innerWidth; 
} else {
    canvas.width = window.innerWidth * 4;
}

const horizontal = canvas.width;


// Definindo as dimensões do tabuleiro
const rows = 8; // 8 linhas horizontais
const cols = 12; // 12 colunas verticais
const squareSize = horizontal/cols;
const unidade = squareSize/4;
canvas.height = squareSize*8
console.log(horizontal)
console.log(squareSize)
// Desenhando o tabuleiro

function drawTable() {
    
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        // Calculando a posição de cada quadrado
        let x = col * (squareSize);
        let y = row * (squareSize); 

        // Desenhando o quadrado
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x, y, squareSize, squareSize);

    }        
}

/// criar horizontal 
for (let i = 0; i < rows * 4; i++) {
    ctx.strokeStyle = (i) % 4 === 0 ? '#000' : '#ccc';
    ctx.beginPath();
    ctx.moveTo(0, i * (squareSize/4));
    ctx.lineTo(canvas.width, i * (squareSize/4));
    ctx.stroke();
}
/// criar vertical 
for (let j = 0; j < cols * 4; j++) {
    ctx.strokeStyle = (j) % 4 === 0 ? '#000' : '#ccc';
    
    ctx.beginPath();
    ctx.moveTo(j * (squareSize/4), 0);
    ctx.lineTo(j * (squareSize/4), canvas.height);
    
    ctx.stroke();
}

/// criar circulo 
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

    // Preencher o retângulo
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Adicionar borda
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

function drawSolarPanel(ctx, x, y, width, height, rows, cols) {
    // Desenha a moldura arredondada do painel
    drawRoundedRect(ctx, x - 4, y - 4, width + 16, height + 16, 15, '#ccc', '#000', 3);

    // Definir o tamanho das células solares
    let cellWidth = width / cols;
    let cellHeight = height / rows;

    // Desenha as células solares
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cellX = x + col * cellWidth + 4;
            let cellY = y + row * cellHeight + 4;

            ctx.fillStyle = '#043E7D'; // Azul escuro para as células
            ctx.fillRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);

            ctx.strokeStyle = '#ccc'; // Cinza claro para efeito de grade
            ctx.strokeRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
        }
    }
}
// Variáveis de controle de arrasto
let dragging = false;
let offsetX, offsetY;

// Evento para iniciar o arrasto
canvas.addEventListener('mousedown', function(e) {
    dragging = true;
    // Posição inicial de onde o mouse foi pressionado
    offsetX = e.offsetX;
    offsetY = e.offsetY;
});

// Evento para atualizar a posição enquanto arrasta
canvas.addEventListener('mousemove', function(e) {
    if (dragging) {
        // Calcula o novo X e Y com base no movimento
        let newX = e.offsetX - offsetX;
        let newY = e.offsetY - offsetY;

        // Desenha o painel solar na nova posição
        ctx.clearRect(0,0, canvas.width, canvas.height);
        drawTable();
        drawSolarPanel(ctx, newX, newY, 12 * unidade, 8 * unidade, 4, 6);
    }
});

// Evento para parar o arrasto
canvas.addEventListener('mouseup', function() {
    dragging = false;
});


// Exemplo de uso
drawSolarPanel(ctx, unidade, unidade, 12 * unidade, 8 * unidade, 4, 6);
