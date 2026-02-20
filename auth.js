import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.register = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        role: "user",
        createdAt: new Date()
    });


    window.location.href = "index.html";
};

window.login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
};

window.goHome = () => {
    window.location.href = "index.html";
};
