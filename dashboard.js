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

const dashboardContainer = document.getElementById("dashboard-container");

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

            // Load orders for stats
            const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
            const ordersSnap = await getDocs(ordersQuery);
            const orders = ordersSnap.docs.map(doc => doc.data());
            const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
            const orderCount = orders.length;

            dashboardContainer.innerHTML = `
                <div class="dashboard-welcome">
                    <h1>Добре дошъл, ${data.username}!</h1>
                    <p>Твоят персонален dashboard в Divi Selqni.</p>
                </div>
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>📊 Статистика</h3>
                        <p>Поръчки: ${orderCount}</p>
                        <p>Общо похарчено: ${totalSpent} лв</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>🛒 Бърз достъп</h3>
                        <button onclick="openModal('shop')">Магазин</button>
                        <button onclick="window.location.href='profile.html'">Профил</button>
                    </div>
                    <div class="dashboard-card">
                        <h3>📢 Новини</h3>
                        <p>Нови продукти скоро!</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>🎮 Игри</h3>
                        <p>Играй и печели!</p>
                    </div>
                </div>
            `;

            document.getElementById("logoutNav").addEventListener("click", async () => {
                await signOut(auth);
                window.location.href = "login.html";
            });

        } else {
            dashboardContainer.innerHTML = `<p>Няма намерени данни.</p>`;
        }

    } catch (error) {
        dashboardContainer.innerHTML = `<p>Грешка при зареждане.</p>`;
        console.error(error);
    }

});