const DOM = {
    sections: document.querySelectorAll("section"),
    navLi: document.querySelectorAll(".sidebar nav ul li"),
    hackerTitles: document.querySelectorAll(".hacker-title"),
    typingElement: document.querySelector(".typing-effect")
};

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?";

/* Helpers */
const getTextNodes = (element) => {
    let nodes = [];
    if (element.nodeType === Node.TEXT_NODE) {
        nodes.push(element);
    } else {
        element.childNodes.forEach(child => {
            nodes = nodes.concat(getTextNodes(child));
        });
    }
    return nodes;
};

const originalTextMap = new Map();

/* Glitch Contínuo */
const startContinuousGlitch = (target) => {
    const textNodes = getTextNodes(target);
    
    if (!originalTextMap.has(target)) {
        const state = textNodes.map(node => ({
            node: node,
            originalText: node.textContent
        }));
        originalTextMap.set(target, state);
    }

    const state = originalTextMap.get(target);

    setInterval(() => {
        // Restaura o texto original antes de glitchar de novo
        state.forEach(item => item.node.textContent = item.originalText);

        // Aplica o glitch em nós aleatórios (2 letras por vez)
        for (let i = 0; i < 2; i++) {
            const randomEntry = state[Math.floor(Math.random() * state.length)];
            // Proteção caso o nó não exista mais
            if (!randomEntry) continue;
            
            const text = randomEntry.originalText;
            if (!text.trim()) continue;

            const charIndex = Math.floor(Math.random() * text.length);
            const randomChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            
            // Reconstrói a string com o caractere trocado
            const newText = text.substring(0, charIndex) + randomChar + text.substring(charIndex + 1);
            
            randomEntry.node.textContent = newText;
        }

        // Efeito flash (Restaura rápido)
        setTimeout(() => {
            state.forEach(item => item.node.textContent = item.originalText);
        }, 150);

    }, 3000);
};

/* Typewriter (Efeito de Digitação do Nome) */
function initTypeWriter(element) {
    if (!element) return;

    const contentParts = [
        { text: "Olá, eu sou ", type: "normal" },
        { text: "Caio José", type: "highlight" },
        { text: ",", type: "normal" }
    ];

    element.textContent = ""; 
    
    let partIndex = 0;
    let charIndex = 0;
    let currentContainer = element;

    function type() {
        if (partIndex >= contentParts.length) {
            // Fim da digitação.
            // NÃO chamamos o glitch aqui para o nome ficar estático e legível.
            return;
        }

        const part = contentParts[partIndex];

        // Cria o span verde para o nome "Caio José"
        if (charIndex === 0 && part.type === "highlight") {
            const span = document.createElement("span");
            span.className = "typing-highlight";
            element.appendChild(span);
            currentContainer = span;
        } else if (charIndex === 0 && part.type === "normal") {
            currentContainer = element;
        }

        currentContainer.innerHTML += part.text[charIndex];
        
        charIndex++;

        if (charIndex >= part.text.length) {
            charIndex = 0;
            partIndex++;
        }

        // Velocidade aleatória de digitação (Humanizada)
        setTimeout(type, Math.random() * 100 + 50);
    }

    setTimeout(type, 1000);
}

// Inicia a digitação na Home
initTypeWriter(DOM.typingElement);

/* Matrix Decode (Para os Títulos das Seções) */
const decodeEffect = (target) => {
    let iterations = 0;
    const originalText = target.dataset.value;
    
    const interval = setInterval(() => {
        const newText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) return originalText[index];
                return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            })
            .join("");

        target.textContent = newText;

        if (iterations >= originalText.length) {
            clearInterval(interval);
            // Inicia o glitch suave nos títulos após decodificar
            startContinuousGlitch(target);
        }
        iterations += 1 / 3;
    }, 30);
};

// Observador para ativar o efeito nos títulos quando aparecem na tela
const titleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            decodeEffect(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

DOM.hackerTitles.forEach(title => titleObserver.observe(title));

/* Reveal on Scroll (Aparição suave das seções) */
const sectionRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        } else if (entry.target.id !== 'home') {
            // Remove a classe se sair da tela (para animar de novo se subir)
            // Se preferir que anime só uma vez, remova este 'else if'
            entry.target.classList.remove('section-visible');
        }
    });
}, { root: null, threshold: 0.1 });

DOM.sections.forEach(section => sectionRevealObserver.observe(section));

/* Sidebar Ativa (Menu Lateral Iluminado) */
window.addEventListener('scroll', () => {
    let current = "";
    
    DOM.sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute("id");
        }
    });

    // Ajuste para o final da página (Contato)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = "contato";
    }

    DOM.navLi.forEach((li) => {
        li.classList.remove("active");
        if (li.querySelector('a').getAttribute("href").includes(current)) {
            li.classList.add("active");
        }
    });
});

/* --- Binary Rain Effect (Fundo Matrix) --- */
const setupBinaryRain = () => {
    const rainLines = document.querySelectorAll('.hacker-line');
    const characters = "10"; // Chuva de binários
    
    if (rainLines.length === 0) return;

    rainLines.forEach(line => {
        let content = "";
        // Cria uma coluna vertical de números aleatórios
        for(let i = 0; i < 25; i++) {
            content += characters.charAt(Math.floor(Math.random() * characters.length)) + "\n"; 
        }
        line.innerText = content;
    });
};

// Inicia a chuva
setupBinaryRain();