// ===== STAR BACKGROUND =====
const canvas = document.getElementById('canvas-stars');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(88,101,242,${this.opacity})`;
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
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();

// Hamburger menu toggle
window.toggleMenu = () => {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('show');
};
animate();


// ===== MODALS =====
const modalData = {
    shop: `
        <h2>🛒 МАГАЗИН</h2>
        <div id="products">
            <div class="product-card">
                <h3>VIP Status</h3>
                <p>Специален статус в Discord</p>
                <p class="price">10 лв</p>
                <button onclick="addToCart('VIP Status', 10)">Добави в количка</button>
            </div>
            <div class="product-card">
                <h3>Custom Role</h3>
                <p>Персонализирана роля</p>
                <p class="price">5 лв</p>
                <button onclick="addToCart('Custom Role', 5)">Добави в количка</button>
            </div>
            <div class="product-card">
                <h3>Boost</h3>
                <p>Boost за сървъра</p>
                <p class="price">15 лв</p>
                <button onclick="addToCart('Boost', 15)">Добави в количка</button>
            </div>
        </div>
        <button onclick="viewCart()">Виж количка</button>
    `,
    cart: `
        <h2>🛒 Количка</h2>
        <div id="cart-items"></div>
        <p id="total">Общо: 0 лв</p>
        <button onclick="checkout()">Checkout</button>
        <button onclick="openModal('shop')">Назад към магазин</button>
    `,
    checkout: `
        <h2>💳 Checkout</h2>
        <form id="checkout-form">
            <input type="text" placeholder="Име" required>
            <input type="email" placeholder="Email" required>
            <input type="text" placeholder="Адрес" required>
            <button type="submit">Плати</button>
        </form>
    `,
    settings: `
        <h2>⚙️ Настройки</h2>
        <p>Тема: <select><option>Тъмна</option><option>Светла</option></select></p>
        <p>Език: <select><option>Български</option><option>English</option></select></p>
        <button>Запази</button>
    `,
    rules: `<h2>ПРАВИЛА</h2><p>Soon...</p>`,
    links: `<h2>ВРЪЗКИ</h2><p>Soon...</p>`
};

function openModal(type) {
    document.getElementById('modal-body').innerHTML = modalData[type];
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// ===== CART FUNCTIONS =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавен в количката!`);
}

function viewCart() {
    openModal('cart');
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const total = document.getElementById('total');
    cartItems.innerHTML = cart.map(item => `<p>${item.name} - ${item.price} лв</p>`).join('');
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    total.textContent = `Общо: ${totalPrice} лв`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Количката е празна!');
        return;
    }
    openModal('checkout');
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
}

async function handleCheckout(e) {
    e.preventDefault();
    const form = e.target;
    const name = form[0].value;
    const email = form[1].value;
    const address = form[2].value;

    // Simulate payment
    alert('Плащането е успешно!');

    // Save order to Firestore if logged in
    if (currentUser) {
        const order = {
            userId: currentUser.uid,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price, 0),
            name, email, address,
            date: new Date()
        };
        await window.addDoc(window.collection(window.db, 'orders'), order);
    }

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    closeModal();
    alert('Поръчката е завършена!');
}


let currentUser = null;

// Проверка дали има логнат потребител
window.onAuthStateChanged(window.auth, async (user) => {
    const authBtn = document.getElementById("auth-button");
    const userInfo = document.getElementById("user-info");

    if (user) {
        currentUser = user;
        if (authBtn) authBtn.innerText = "ACCOUNT";
        if (userInfo) {
            // Get user data
            const docRef = window.doc(window.db, "users", user.uid);
            const docSnap = await window.getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                userInfo.innerHTML = `${data.username} (${data.role}) <button onclick="logout()">Logout</button>`;
            }
        }
    } else {
        currentUser = null;
        if (authBtn) authBtn.innerText = "REGISTER";
        if (userInfo) userInfo.innerHTML = "";
    }
});

function handleAuthClick() {
    if (currentUser) {
        window.location.href = "profile.html";
    } else {
        window.location.href = "login.html";
    }
}

function openRegister() {
    document.getElementById('modal-body').innerHTML = `
        <h2>REGISTER</h2>
        <input id="email" placeholder="Email">
        <input id="password" type="password" placeholder="Password">
        <input id="username" placeholder="Username">
        <button onclick="register()">Register</button>
        <p style="margin-top:10px;cursor:pointer;color:#888;" onclick="openLogin()">Already have account? Login</p>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
}

function openLogin() {
    document.getElementById('modal-body').innerHTML = `
        <h2>LOGIN</h2>
        <input id="email" placeholder="Email">
        <input id="password" type="password" placeholder="Password">
        <button onclick="login()">Login</button>
    `;
}

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    try {
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;

        await window.setDoc(window.doc(window.db, "users", user.uid), {
            username,
            email,
            createdAt: new Date()
        });

        showProfile(user.uid);
    } catch (error) {
        alert(error.message);
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        showProfile(userCredential.user.uid);
    } catch (error) {
        alert(error.message);
    }
}

async function showProfile(uid) {
    const docRef = window.doc(window.db, "users", uid);
    const docSnap = await window.getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        document.getElementById('modal-body').innerHTML = `
            <h2>PROFILE</h2>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <button onclick="logout()">Logout</button>
        `;
        document.getElementById('modal-overlay').style.display = 'flex';
    }
}

function logout() {
    window.signOut(window.auth);
    closeModal();
}

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}