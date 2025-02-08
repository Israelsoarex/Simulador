
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

function drawControler(x, y, width, height){
    drawRoundedRect(ctx, x - 4, y - 4, width + 16, height + 16, 15, '#043E7D', '#000', 3);
}

drawControler(16*unidade, 4*unidade, 9*unidade, 5*unidade)



class Painel {
    constructor(x, y, width, height, rows, cols, label = "Painel Solar") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.colliding = false;
        this.backupX = x;  
        this.backupY = y;
        this.label = label;
    }

    draw(ctx, panels) {
    this.colliding = panels.some(panel => panel !== this && checkCollision(this, panel)) || checkCollision(this, bateria);
    const borderColor = this.colliding ? 'red' : '#000';
    
    // Desenha os retângulos para os símbolos "+" e "-" à direita
    const rectWidth = 40;
    const rectHeight = 30;
    const symbolPadding = 5;

    // Retângulo para o símbolo "+"
ctx.fillStyle = '#EF476F'; // Azul escuro
ctx.fillRect(this.x + this.width + 10, this.y + 20, rectWidth, rectHeight);

// Definir a cor da fonte e o peso
ctx.fillStyle = '#fff';
ctx.font = 'bold 2rem Arial'; // Peso 700 e tamanho 1.4rem
ctx.fillText('+', this.x + this.width +25 + symbolPadding, this.y + 45); // Posição do "+"

// Retângulo para o símbolo "-"
ctx.fillStyle = '#118AB2'; // Azul escuro
ctx.fillRect(this.x + this.width + 10, this.y + 60, rectWidth, rectHeight);
ctx.font = 'bold 3rem Arial';
// Definir a cor da fonte e o peso para o "-"
ctx.fillStyle = '#fff';
ctx.fillText('-', this.x + this.width + 25 + symbolPadding, this.y + 90); // Posição do "-"
    // Desenha o painel com borda arredondada
    drawRoundedRect(ctx, this.x - 4, this.y - 4, this.width + 16, this.height + 16, 15, '#ccc', borderColor, 3);

    let cellWidth = this.width / this.cols;
    let cellHeight = this.height / this.rows;

    // Desenha as células com border-radius
    for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
        let cellX = this.x + col * cellWidth + 4;
        let cellY = this.y + row * cellHeight + 4;
        ctx.fillStyle = '#043E7D';
        ctx.beginPath();
        // Alterando o valor do raio de 5 para 10 para bordas mais arredondadas
        const radius = 5; 
        ctx.moveTo(cellX + radius, cellY); // Início do arco
        ctx.arcTo(cellX + cellWidth - radius, cellY, cellX + cellWidth - radius, cellY + cellHeight, radius); // Arco superior direito
        ctx.arcTo(cellX + cellWidth - radius, cellY + cellHeight, cellX + radius, cellY + cellHeight, radius); // Arco inferior direito
        ctx.arcTo(cellX + radius, cellY + cellHeight, cellX + radius, cellY, radius); // Arco inferior esquerdo
        ctx.arcTo(cellX + radius, cellY, cellX + cellWidth - radius, cellY, radius); // Arco superior esquerdo
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }
}

       ctx.font = 'bold 1.5rem Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height + 50);
    // Saídas para fios (circular)
    const wireExitSize = 10;
    ctx.beginPath();
    ctx.arc(this.x - wireExitSize, this.y + this.height / 2, wireExitSize, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x + this.width + wireExitSize, this.y + this.height / 2, wireExitSize, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    startDrag(x, y) {
        if (this.isInside(x, y)) {
            this.dragging = true;
            this.startX = x - this.x;
            this.startY = y - this.y;
            // Faz backup da posição inicial antes de mover
            this.backupX = this.x;
            this.backupY = this.y;
        }
    }

    move(x, y, canvas) {
        if (this.dragging) {
            this.x = Math.max(unidade, Math.min(x - this.startX, canvas.width - this.width - unidade));
            this.y = Math.max(unidade, Math.min(y - this.startY, canvas.height - this.height - unidade));

            
        }
    }

    stopDrag() {
        this.dragging = false;
        if (this.colliding) {
                this.x = this.backupX;
                this.y = this.backupY;
            } else{
                this.backupX = this.x;
                this.backupY = this.y;
            }
    }
}

// Função para verificar colisões
function checkCollision(obj1, obj2) {
    return !(obj1.x + obj1.width < obj2.x || 
             obj1.x > obj2.x + obj2.width || 
             obj1.y + obj1.height < obj2.y || 
             obj1.y > obj2.y + obj2.height);
}


function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    panels.forEach(panel => panel.draw(ctx, panels));
    bateria.draw(ctx);
}

let panels = [
    new Painel(panelX, panelY, 12 * unidade, 8 * unidade, 4, 6),
    new Painel(panelX + 800, panelY + 400, 14 * unidade, 7 * unidade, 4, 6)
];


// Inicializa o desenho




// Classe Bateria com movimentação e verificação de colisões
class Bateria {
    constructor(x, y, width, height, label="Bateria") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.backupX = x;
        this.backupY = y;
        this.label = label;
        this.colliding = false;
    }

    draw(ctx) {
    this.colliding = panels.some(panel => panel !== this && checkCollision(this, panel));
    // corpo da bateria
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // parte superior
    ctx.fillStyle = '#888';
    ctx.fillRect(this.x + 10, this.y - 10, this.width - 20, 10);
    // polo positivo
    ctx.fillStyle = '#EF476F';
    ctx.fillRect(this.x + this.width - 35, this.y - 20, 30, 20);
    // polo negativo
    ctx.fillStyle = '#118AB2';
    ctx.fillRect(this.x + 5, this.y - 20, 30, 20);
    // parte central
    ctx.fillStyle = '#777';
    ctx.fillRect(this.x + 15, this.y + 10, this.width - 30, this.height - 20);
    // label
    ctx.font = 'bold 1.5rem Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height + 50);
    // relâmpago
    ctx.font = '48px sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('⚡', this.x + this.width / 2, (this.y + this.height / 2) + 12);
    
    // símbolos de + e - no polo
    ctx.font = 'bold 1.2rem Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('+', this.x + this.width - 20, this.y - 2); // Polo positivo
    ctx.fillText('-', this.x + 20, this.y - 2); // Polo negativo

    // borda da bateria
    ctx.strokeStyle = this.colliding ? 'red' : '#000';
    ctx.lineWidth = this.colliding ? 3 : 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    startDrag(x, y) {
        if (this.isInside(x, y)) {
            this.dragging = true;
            this.startX = x - this.x;
            this.startY = y - this.y;
            this.backupX = this.x;
            this.backupY = this.y;
        }
    }

    move(x, y, canvas) {
        if (this.dragging) {
            this.x = Math.max(unidade, Math.min(x - this.startX, canvas.width - this.width - unidade));
            this.y = Math.max(unidade, Math.min(y - this.startY, canvas.height - this.height - unidade));
            this.colliding = panels.some(panel => checkCollision(this, panel));
        }
    }

    stopDrag(panels) {
        this.dragging = false;
        this.colliding = panels.some(panel => checkCollision(this, panel));

        if (this.colliding) {
            this.x = this.backupX;
            this.y = this.backupY;
        } else {
            this.backupX = this.x;
            this.backupY = this.y;
        }
    }
}


// Criando uma instância da classe Bateria
const bateria = new Bateria(200, 400, 7*unidade, 4*unidade);

// Desenhando a bateria no canvas
bateria.draw(ctx);


canvas.addEventListener('mousedown', (e) => {
    panels.forEach(panel => panel.startDrag(e.offsetX, e.offsetY));
    bateria.startDrag(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    panels.forEach(panel => panel.move(e.offsetX, e.offsetY, canvas));
    bateria.move(e.offsetX, e.offsetY, canvas);
    redraw();
});

canvas.addEventListener('mouseup', () => {
    panels.forEach(panel => panel.stopDrag());
    bateria.stopDrag(panels);
    redraw();
});

canvas.addEventListener('touchstart', (e) => {
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    panels.forEach(panel => panel.startDrag(x, y));
    bateria.startDrag(x, y);
});

canvas.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    panels.forEach(panel => panel.move(x, y, canvas));
    bateria.move(x, y, canvas);
    redraw();
});

canvas.addEventListener('touchend', () => {
    panels.forEach(panel => panel.stopDrag());
    bateria.stopDrag(panels);
    redraw();
});


// Inicializa o desenho
redraw();
let isDrawing = false;  // Controla se o usuário está desenhando
let startX, startY;  // Armazenam a posição inicial do mouse

// Função para desenhar fios
function drawWire(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000';  // Cor do fio
    ctx.lineWidth = 2;  // Espessura da linha
    ctx.beginPath();
    ctx.moveTo(x1, y1);  // Ponto inicial
    ctx.lineTo(x2, y2);  // Ponto final
    ctx.stroke();
}

// Adiciona a interação do mouse
canvas.addEventListener('mousedown', (event) => {
    // Captura a posição do mouse ao clicar
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Verifica se o mouse clicou em um painel ou na bateria
    panels.forEach(panel => {
        // Verifica se o clique foi dentro da área de saída de fio do painel
        if (mouseX >= panel.x - 10 && mouseX <= panel.x + panel.width + 10 &&
            mouseY >= panel.y + panel.height / 2 - 10 && mouseY <= panel.y + panel.height / 2 + 10) {
            isDrawing = true;
            startX = mouseX;
            startY = mouseY;
        }
    });

    if (mouseX >= bateria.x + bateria.width - 35 && mouseX <= bateria.x + bateria.width - 5 &&
        mouseY >= bateria.y - 20 && mouseY <= bateria.y) {
        isDrawing = true;
        startX = mouseX;
        startY = mouseY;
    }
});

// Função para mover o fio enquanto o mouse se move
canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        redraw();  // Redesenha todos os componentes do painel, bateria, etc.
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        drawWire(startX, startY, mouseX, mouseY);  // Desenha o fio enquanto o mouse move
    }
});

// Finaliza a linha quando o mouse é solto
canvas.addEventListener('mouseup', (event) => {
    if (isDrawing) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Verifica se o mouse está sobre a bateria ou painel para finalizar a conexão
        panels.forEach(panel => {
            if (mouseX >= panel.x - 10 && mouseX <= panel.x + panel.width + 10 &&
                mouseY >= panel.y + panel.height / 2 - 10 && mouseY <= panel.y + panel.height / 2 + 10) {
                drawWire(startX, startY, panel.x + panel.width + 10, panel.y + panel.height / 2); // Conecta no painel
            }
        });

        if (mouseX >= bateria.x + bateria.width - 35 && mouseX <= bateria.x + bateria.width - 5 &&
            mouseY >= bateria.y - 20 && mouseY <= bateria.y) {
            drawWire(startX, startY, bateria.x + bateria.width - 35, bateria.y - 10); // Conecta na bateria
        }

        isDrawing = false;
    }
});
