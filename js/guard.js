import { auth } from "./firebase.js";

auth.onAuthStateChanged(user => {
  if (!user) location.href = "index.html";
});
