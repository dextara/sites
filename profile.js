window.onAuthStateChanged(window.auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const docRef = window.doc(window.db, "users", user.uid);
    const docSnap = await window.getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        document.getElementById("profile-card").innerHTML = `
            <h2>PROFILE</h2>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <button onclick="logout()">Logout</button>
        `;
    }
});

function logout() {
    window.signOut(window.auth);
    window.location.href = "login.html";
}
