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

        window.location.href = "dashboard.html";
    } catch (error) {
        alert(error.message);
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await window.signInWithEmailAndPassword(window.auth, email, password);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert(error.message);
    }
}

function goHome() {
    window.location.href = "index.html";
}
