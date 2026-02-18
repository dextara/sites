import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDF1AhJjp8mkR14i912l2Yvw-9gatJ-vhE",
    authDomain: "divi-selqni.firebaseapp.com",
    projectId: "divi-selqni",
    storageBucket: "divi-selqni.firebasestorage.app",
    messagingSenderId: "222297927821",
    appId: "1:222297927821:web:59232ddc48c644642f72c4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const profileContainer = document.getElementById("profile-container");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Load orders
            const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
            const ordersSnap = await getDocs(ordersQuery);
            const orders = ordersSnap.docs.map(doc => doc.data());

            const ordersHtml = orders.length > 0
                ? orders.map(order => `<p>${order.items.map(i => i.name).join(', ')} - ${order.total} лв</p>`).join('')
                : '<p>Няма поръчки.</p>';

            profileContainer.innerHTML = `
                <div class="profile-card">
                    <h3>👤 Лична Информация</h3>
                    <p><strong>Username:</strong> ${data.username}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                </div>
                <div class="profile-card">
                    <h3>⚙️ Настройки</h3>
                    <button id="logoutBtn">🚪 Logout</button>
                </div>
                <div class="profile-card">
                    <h3>🛒 Магазин</h3>
                    <p>Тук е Checkout функционалността.</p>
                    <button onclick="openModal('shop')">Виж Магазина</button>
                </div>
                <div class="profile-card">
                    <h3>📦 Моите Поръчки</h3>
                    ${ordersHtml}
                </div>
            `;

            document.getElementById("logoutBtn").addEventListener("click", async () => {
                await signOut(auth);
                window.location.href = "login.html";
            });

            document.getElementById("logoutNav").addEventListener("click", async () => {
                await signOut(auth);
                window.location.href = "login.html";
            });

        } else {
            profileContainer.innerHTML = `<div class="profile-card"><p>Няма намерени данни за профила.</p></div>`;
        }

    } catch (error) {
        profileContainer.innerHTML = `<div class="profile-card"><p>Грешка при зареждане на профила.</p></div>`;
        console.error(error);
    }

});
