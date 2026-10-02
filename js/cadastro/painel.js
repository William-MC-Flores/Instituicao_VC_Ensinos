
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./firebase.js";

const userNameElement = document.getElementById("user-name");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../pages/login.html";
    return;
  }

  userNameElement.textContent = user.displayName || user.email || "Usuário";
});
