const emailElement = document.getElementById("verification-email");

try {
  const email = sessionStorage.getItem("vcensinos-pending-verification-email");
  if (email && emailElement) {
    emailElement.textContent = email;
    emailElement.hidden = false;
  }
} catch {
  // As instruções principais continuam disponíveis sem sessionStorage.
}
