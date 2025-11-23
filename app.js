const ROTOR1 = [2,15,30,28,26,24,22,20,18,16,13,9,7,11,1,31,17,5,3,25,23,29,27,19,21,16,14,12,10,8,6,4];
const ROTOR2 = [16,12,29,26,24,22,18,15,13,11,9,7,5,20,1,31,16,27,25,23,21,19,17,2,14,30,4,10,8,6,28,3];
const ROTOR3 = [16,29,27,1,31,23,21,19,17,14,12,10,8,6,4,2,16,30,28,26,24,22,20,18,7,15,13,11,9,5,3,25];
let rotor1 = [];
let rotor2 = [];
let rotor3 = [];
const refletor = [16,5,3,25,23,29,27,19,21,15,12,14,8,10,4,6,16,2,28,30,24,26,20,22,17,18,13,9,7,11,1,31];
const dicionario = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ",".","?","!",":",","];
let novoDicionario = [...dicionario];
let posicao_rotor1 = 0;
let posicao_rotor2 = 0;
let posicao_rotor3 = 0;
let posicaoOriginal = [0,0,0];
let msg;
let msg_criptografada;
let letra_temp;
let numero_letra;
let dragging = null;
const ligacoes = []; 
const conexoes = {}; 

function atualizarDicionario() {
    novoDicionario = [...dicionario];
    for (const [letra1, letra2] of ligacoes) {
        const index1 = novoDicionario.indexOf(letra1);
        const index2 = novoDicionario.indexOf(letra2);
        if (index1 !== -1 && index2 !== -1) {
            [novoDicionario[index1], novoDicionario[index2]] = [novoDicionario[index2], novoDicionario[index1]];
        }
    }
}

function verificarDicionario(letra_temp) {
    for(let j = 0; j < 32; j++) {
        if(letra_temp === novoDicionario[j]) {
            numero_letra = j;
            break;
        }
    }
}

function saidaDicionario(numero_letra) {
    for(let k = 0; k < 32; k++) {
        if(numero_letra === k) {
            letra_temp = novoDicionario[k];
            break;
        }
    }
}

function passarRotor1() { numero_letra = (numero_letra + rotor1[numero_letra]) % 32; }
function passarRotor2() { numero_letra = (numero_letra + rotor2[numero_letra]) % 32; }
function passarRotor3() { numero_letra = (numero_letra + rotor3[numero_letra]) % 32; }

function passarRefletor() { numero_letra = (numero_letra + refletor[numero_letra]) % 32; }

function setRotores() {
    posicao_rotor1 = parseInt(document.getElementById('posicaoRotor1').value) || 0;
    posicao_rotor2 = parseInt(document.getElementById('posicaoRotor2').value) || 0;
    posicao_rotor3 = parseInt(document.getElementById('posicaoRotor3').value) || 0;

    for(let j = 0; j < 32; j++) {
        rotor1[j] = ROTOR1[(j + posicao_rotor1) % 32];
        rotor2[j] = ROTOR2[(j + posicao_rotor2) % 32];
        rotor3[j] = ROTOR3[(j + posicao_rotor3) % 32];
    }
}

function reutilizarRotores() {
    document.getElementById('posicaoRotor1').value = posicaoOriginal[0];
    document.getElementById('posicaoRotor2').value = posicaoOriginal[1];
    document.getElementById('posicaoRotor3').value = posicaoOriginal[2];
}

function memorizarRotores() {
    setRotores();
    posicaoOriginal[0] = posicao_rotor1;
    posicaoOriginal[1] = posicao_rotor2;
    posicaoOriginal[2] = posicao_rotor3;
}

function msgCriptografadoNaEntrada() {
    document.getElementById("msgOriginal").value = document.getElementById("msgCriptografada").value;
}

function criptografarMsg() {
    atualizarDicionario();
    msg_criptografada = "";
    msg = document.getElementById("msgOriginal").value.toUpperCase();
    memorizarRotores();

    for(let i = 0; i < msg.length; i++) {
        setRotores();
        verificarDicionario(msg[i]);
        passarRotor1();
        passarRotor2();
        passarRotor3();
        passarRefletor();
        passarRotor3();
        passarRotor2();
        passarRotor1();
        saidaDicionario(numero_letra);
        msg_criptografada += letra_temp;

        posicao_rotor1 = (posicao_rotor1 + 1) % 32;
        document.getElementById('posicaoRotor1').value = posicao_rotor1;

        if(posicao_rotor1 === 0) {
            posicao_rotor2 = (posicao_rotor2 + 1) % 32;
            document.getElementById('posicaoRotor2').value = posicao_rotor2;
            if(posicao_rotor2 === 0) {
                posicao_rotor3 = (posicao_rotor3 + 1) % 32;
                document.getElementById('posicaoRotor3').value = posicao_rotor3;
            }
        }
    }
    document.getElementById("msgCriptografada").value = msg_criptografada;
}

// --- FUNÇÕES DE DESENHO E INTERAÇÃO ---

function desenharLinha(char1, char2) {
    const square1 = [...document.querySelectorAll('.square')].find(sq => sq.dataset.char === char1);
    const square2 = [...document.querySelectorAll('.square')].find(sq => sq.dataset.char === char2);

    if (!square1 || !square2) return;

    const rect1 = square1.getBoundingClientRect();
    const rect2 = square2.getBoundingClientRect();
    const svg = document.getElementById('svg-linhas');
    const svgRect = svg.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - svgRect.left;
    const y1 = rect1.top + rect1.height / 2 - svgRect.top;
    const x2 = rect2.left + rect2.width / 2 - svgRect.left;
    const y2 = rect2.top + rect2.height / 2 - svgRect.top;

    const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linha.setAttribute("x1", x1);
    linha.setAttribute("y1", y1);
    linha.setAttribute("x2", x2);
    linha.setAttribute("y2", y2);
    linha.setAttribute("stroke", "black");
    linha.setAttribute("stroke-width", "5");
    linha.setAttribute("data-pares", `${char1},${char2}`);
    
    linha.style.cursor = "pointer";
    linha.style.pointerEvents = "stroke";

    linha.addEventListener("click", (e) => {
        e.stopPropagation();

        delete conexoes[char1];
        delete conexoes[char2];

        const index = ligacoes.findIndex(l =>
            (l[0] === char1 && l[1] === char2) || (l[0] === char2 && l[1] === char1));
        if (index !== -1) {
            ligacoes.splice(index, 1);
        }

        // CORREÇÃO: Remover classe E limpar estilo inline background
        // Isso garante que a cor volte ao verde original (definido no CSS)
        square1.classList.remove('connected');
        square1.style.backgroundColor = "";
        
        square2.classList.remove('connected');
        square2.style.backgroundColor = "";

        atualizarDicionario();
        linha.remove();
    });
    
    linha.addEventListener('mouseover', () => { linha.setAttribute("stroke", "#ba5c12"); });
    linha.addEventListener('mouseout', () => { linha.setAttribute("stroke", "#474a2c"); });

    svg.appendChild(linha);
}

const chars = ["A","B","C","D","E","F","G","H","I","J","K","L","M",
               "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
               " ", ".", "?", "!", ":", ","];
const container = document.getElementById('circle');
const total = chars.length;
const raio = 250;

chars.forEach((char, i) => {
    const angle = (i / total) * 2 * Math.PI;
    const x = Math.cos(angle) * raio;
    const y = Math.sin(angle) * raio;

    const square = document.createElement('div');
    square.className = 'square';
    square.textContent = char === ' ' ? '␣' : char;
    square.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    square.dataset.char = char;

    square.addEventListener('mousedown', (e) => {
        if (conexoes[char]) return; 
        dragging = char;
        square.style.backgroundColor = "var(--burnt-orange)";
        e.stopPropagation();
    });

    square.addEventListener('mouseup', (e) => {
        if (!dragging || dragging === char || conexoes[char]) return;
        if (conexoes[dragging]) return;

        conexoes[dragging] = char;
        conexoes[char] = dragging;
        ligacoes.push([dragging, char]);

        desenharLinha(dragging, char);
        
        // CORREÇÃO: Limpa o background inline do elemento que foi arrastado
        // E deixa apenas a classe controlar a cor
        const dragSquare = [...document.querySelectorAll('.square')].find(sq => sq.dataset.char === dragging);
        if(dragSquare) {
            dragSquare.classList.add('connected');
            dragSquare.style.backgroundColor = ""; // Remove o estilo do 'mousedown'
        }
        
        square.classList.add('connected');

        atualizarDicionario();
        dragging = null;
        e.stopPropagation();
    });

    container.appendChild(square);
});

// Listener global para resetar se soltar fora
document.addEventListener('mouseup', () => {
    if(dragging) {
        const dragSquare = [...document.querySelectorAll('.square')].find(sq => sq.dataset.char === dragging);
        // Se soltou fora e não conectou, remove a cor
        if(dragSquare && !conexoes[dragging]) {
            dragSquare.style.backgroundColor = "";
        }
    }
    dragging = null;
});

const inputMsgOriginal = document.getElementById('msgOriginal');
inputMsgOriginal.addEventListener('input', function() {
    let valor = this.value.toUpperCase();
    valor = valor.replace(/[^A-Z .?!:,]/g, '');
    this.value = valor;
});

const inputRotores = document.querySelectorAll('.rotores');
inputRotores.forEach(input => {
    input.addEventListener('input', function() {
        let valor = parseInt(this.value) || 0;
        if (valor > 31) valor = 0;
        if (valor < 0) valor = 0;
        this.value = valor;
    });
});

setRotores();