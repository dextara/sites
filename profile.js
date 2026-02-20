import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("profile-container");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
        container.innerHTML = "<p>Няма намерени данни.</p>";
        return;
    }

    const data = snap.data();

    // Load orders
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
    const ordersSnap = await getDocs(ordersQuery);
    const orders = ordersSnap.docs.map(doc => doc.data());
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    container.innerHTML = `
        <div class="profile-card">
            <h3>👤 Лична Информация</h3>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Role:</strong> ${data.role}</p>
        </div>
        <div class="profile-card">
            <h3>📊 Статистика</h3>
            <p>Поръчки: ${orders.length}</p>
            <p>Общо похарчено: ${totalSpent} лв</p>
        </div>
        <div class="profile-card">
            <h3>⚙️ Настройки</h3>
            <button onclick="changePassword()">Промени парола</button>
            <button onclick="editProfile()">Редактирай профил</button>
        </div>
        <div class="profile-card">
            <h3>🛒 Магазин</h3>
            <button onclick="window.location.href='shop.html'">Отиди в магазина</button>
        </div>
        <div class="profile-card">
            <h3>📦 Моите Поръчки</h3>
            ${orders.length > 0 ? orders.map(order => `<p>${order.items.map(i => i.name).join(', ')} - ${order.total} лв</p>`).join('') : '<p>Няма поръчки.</p>'}
        </div>
        <div class="profile-card">
            <button id="logoutBtn">🚪 Logout</button>
        </div>
    `;

    document.getElementById("logoutBtn").onclick = async () => {
        await signOut(auth);
        window.location.href = "index.html";
    };

});

// Functions for profile actions
window.changePassword = () => {
    alert("Функцията за промяна на парола ще бъде добавена скоро.");
};

window.editProfile = () => {
    alert("Функцията за редактиране на профил ще бъде добавена скоро.");
};
