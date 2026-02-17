const canvas = document.getElementById('canvas-stars');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Малко по-големи за видимост
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Ако излезе от екрана, се появява от другата страна
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(88, 101, 242, ${this.opacity})`; // Discord синьо с променлива прозрачност
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();
animate();

// 2. УПРАВЛЕНИЕ НА ПРОЗОРЦИТЕ
const modalData = {
    shop: `
                <h2 style="color:var(--primary); font-family:Orbitron;">МАГАЗИН</h2>
                <div class="price-card"><span>VIP</span> <strong>2 euro.</strong></div>
                <div class="price-card"><span>Beat</span> <strong>5 euro.</strong></div>
                <div class="price-card"><span>Teniska - soon...</span> <strong>25 euro.</strong></div>
                <p style="font-size:0.8rem; color:#555;">Плащания чрез PayPal / Revolut</p>
            `,
    rules: `
                <h2 style="color:var(--accent); font-family:Orbitron;">ПРАВИЛА</h2>
                <div style="text-align:left; font-size:0.9rem; color:#ccc;">
                    <center>
                    <p> soon </p>
                </div>
            `,
    links: `
                <h2 style="color:#00ffcc; font-family:Orbitron;">ВРЪЗКИ</h2>
                <div style="display:grid; gap:10px;">
                    <a href="#" style="color:#fff; text-decoration:none; background:#1a1a2e; padding:10px; border-radius:10px;">TIKTOK</a>
                    <a href="#" style="color:#fff; text-decoration:none; background:#1a1a2e; padding:10px; border-radius:10px;">YOUTUBE</a>
                </div>
            `
};

function openModal(type) {
    document.getElementById('modal-body').innerHTML = modalData[type];
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}