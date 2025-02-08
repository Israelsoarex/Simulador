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
    constructor(x, y, width, height, rows, cols) {
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
        this.backupX = x;  // Novo atributo para armazenar a posição X de backup
        this.backupY = y;  // Novo atributo para armazenar a posição Y de backup
    }

    draw(ctx, panels) {
    this.colliding = panels.some(panel => panel !== this && checkCollision(this, panel));
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
ctx.fillText('+', this.x + this.width + 15 + symbolPadding, this.y + 45); // Posição do "+"

// Retângulo para o símbolo "-"
ctx.fillStyle = '#118AB2'; // Azul escuro
ctx.fillRect(this.x + this.width + 10, this.y + 60, rectWidth, rectHeight);
ctx.font = 'bold 3rem Arial';
// Definir a cor da fonte e o peso para o "-"
ctx.fillStyle = '#fff';
ctx.fillText('-', this.x + this.width + 15 + symbolPadding, this.y + 90); // Posição do "-"
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
function checkCollision(pn1, pn2) {
    return !(pn1.x + pn1.width < pn2.x || 
             pn1.x > pn2.x + pn2.width || 
             pn1.y + pn1.height < pn2.y || 
             pn1.y > pn2.y + pn2.height);
}

// Função para desenhar a mesa (tabuleiro)
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    panels.forEach(panel => panel.draw(ctx, panels));
    bateria.draw(ctx)
}

let panels = [
    new Painel(panelX, panelY, 12 * unidade, 8 * unidade, 4, 6),
    new Painel(panelX + 800, panelY + 400, 14 * unidade, 7 * unidade, 4, 6)
];


// Inicializa o desenho




// Classe Bateria com movimentação e verificação de colisões
class Bateria {
    constructor(x, y, width, height) {
        this.x = x; // Posição X da bateria
        this.y = y; // Posição Y da bateria
        this.width = width; // Largura da bateria
        this.height = height; // Altura da bateria
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.backupX = x;
        this.backupY = y;
        this.colliding = false; // Verificação de colisão
    }

    // Função para desenhar a bateria no canvas
    draw(ctx) {
        // Cor de fundo da bateria
        ctx.fillStyle = '#333'; // Cor cinza escuro para o corpo da bateria
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Detalhes da parte superior (poliços)
        ctx.fillStyle = '#888'; // Cor do detalhe de cima
        ctx.fillRect(this.x + 10, this.y - 10, this.width - 20, 10);

        // Polos positivo e negativo
        ctx.fillStyle = '#EF476F'; // Polo positivo (vermelho)
        ctx.fillRect(this.x + this.width - 15, this.y - 20, 10, 20); // Polo positivo
        ctx.fillStyle = '#118AB2'; // Polo negativo (azul)
        ctx.fillRect(this.x + 5, this.y - 20, 10, 20); // Polo negativo

        // Detalhe interno da bateria (conectores)
        ctx.fillStyle = '#666'; // Parte interna
        ctx.fillRect(this.x + 15, this.y + 10, this.width - 30, this.height - 20); // Parte interna

        // Contorno da bateria
        ctx.strokeStyle = '#000'; // Cor da borda
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Se houver colisão, mudar a borda para vermelho
        if (this.colliding) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    // Verifica se o ponto (x, y) está dentro da bateria
    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    // Inicia o arraste
    startDrag(x, y) {
        if (this.isInside(x, y)) {
            this.dragging = true;
            this.startX = x - this.x;
            this.startY = y - this.y;
            this.backupX = this.x;
            this.backupY = this.y;
        }
    }

    // Mover a bateria
    move(x, y, canvas) {
        if (this.dragging) {
            this.x = Math.max(unidade, Math.min(x - this.startX, canvas.width - this.width-unidade));
            this.y = Math.max(unidade, Math.min(y - this.startY, canvas.height - this.height-unidade));
        }
    }

    // Para o arraste e verifica colisão com outros objetos
    stopDrag(paineis) {
        this.dragging = false;
        this.colliding = paineis.some(panel => panel !== this && checkCollision(this, panel));

        // Se colidir, retornar à posição original
        if (this.colliding) {
            this.x = this.backupX;
            this.y = this.backupY;
            
        }else{
                this.backupX = this.x;
                this.backupY = this.y;
            }
    }
}


// Criando uma instância da classe Bateria
const bateria = new Bateria(200, 200, 7*unidade, 4*unidade);

// Desenhando a bateria no canvas
bateria.draw(ctx);


canvas.addEventListener('mousedown', (e) => {
    panels.forEach(panel => panel.startDrag(e.offsetX, e.offsetY));
});

canvas.addEventListener('mousemove', (e) => {
    panels.forEach(panel => panel.move(e.offsetX, e.offsetY, canvas));
    redraw();
});

canvas.addEventListener('mouseup', () => {
    panels.forEach(panel => panel.stopDrag());
});

// Eventos de toque
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    panels.forEach(panel => panel.draw(ctx, panels));
    
    bateria.move(x, y, canvas);
    bateria.draw(ctx)
    for (let i = 0; i < panels.length; i++) {
        for (let j = i + 1; j < panels.length; j++) {
            if (checkCollision(panels[i], panels[j])) {
                console.log("Painéis colidiram");
            }
        }
    }
    for (let i = 0; i < panels.length; i++) {
    if (checkCollision(panels[i], bateria)) {
        console.log("Colidiu");
        bateria.colliding = true;
    } else{
        bateria.colliding = false;
    }
}
});

canvas.addEventListener('touchend', () => {
    bateria.stopDrag(panels);
    panels.forEach(panel => panel.stopDrag());
   
});


// Função para verificar colisão entre a bateria e os painéis
function checkCollisionBateria(painel, bateria) {
    return !(painel.x + painel.width < bateria.x || 
             painel.x > bateria.x + bateria.width || 
             painel.y + painel.height < bateria.y || 
             painel.y > bateria.y + bateria.height);
}

canvas.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    panels.forEach(panel => panel.move(x, y, canvas));
    bateria.move(x, y, canvas);
    
    // Verificar colisões
    let collisionDetected = panels.some(panel => checkCollisionBateria(panel, bateria));

    
        
    // Redesenhar o painel
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    panels.forEach(panel => panel.draw(ctx, panels));
    
    
    bateria.draw(ctx)
});

// Event listener para o toque de início e término
canvas.addEventListener('touchstart', (e) => {
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    panels.forEach(panel => panel.startDrag(x, y));
    bateria.startDrag(x, y);
});

canvas.addEventListener('touchend', () => {
    panels.forEach(panel => panel.stopDrag());
    bateria.stopDrag(panels);
});

redraw();
