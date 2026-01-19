import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- ROLE TOGGLE ---------------- */

let role = "doctor";

const doctorBtn = document.getElementById("doctorBtn");
const patientBtn = document.getElementById("patientBtn");

if (doctorBtn && patientBtn) {
  doctorBtn.onclick = () => {
    role = "doctor";
    doctorBtn.classList.add("active");
    patientBtn.classList.remove("active");
    toggleFields();
  };

  patientBtn.onclick = () => {
    role = "patient";
    patientBtn.classList.add("active");
    doctorBtn.classList.remove("active");
    toggleFields();
  };
}

function toggleFields() {
  const empId = document.getElementById("empId");
  const empName = document.getElementById("empName");
  const name = document.getElementById("name");

  if (role === "doctor") {
    empId.style.display = "block";
    empName.style.display = "block";
    name.style.display = "none";
  } else {
    empId.style.display = "none";
    empName.style.display = "none";
    name.style.display = "block";
  }
}

/* ---------------- LOGIN ---------------- */

window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // 🔴 force refresh user state
    await cred.user.reload();

    if (!cred.user.emailVerified) {
      alert("Please verify your email first");
      return;
    }

    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const savedRole = snap.data()?.role;

    if (savedRole !== role) {
      alert("Incorrect role selected");
      return;
    }

    location.href = "home.html";
  } catch (e) {
    alert(e.message);
  }
};

/* ---------------- REGISTER ---------------- */

window.register = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  const empId = document.getElementById("empId")?.value.trim();
  const empName = document.getElementById("empName")?.value.trim();
  const name = document.getElementById("name")?.value.trim();

  if (!email || !password || !confirm) {
    alert("All fields are required");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  if (role === "doctor" && (!empId || !empName)) {
    alert("Doctor details required");
    return;
  }

  if (role === "patient" && !name) {
    alert("Name is required");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      role,
      name: role === "doctor" ? empName : name,
      employeeId: role === "doctor" ? empId : null,
      email,
      createdAt: new Date(),
    });

    // ✅ IMPORTANT: send verification with redirect
    await sendEmailVerification(cred.user, {
      url: "https://khilvansh6789.github.io/CareConnect/verify.html",
    });

    alert("Verification email sent. Please check your inbox.");
    location.href = "verify.html";

  } catch (e) {
    alert(e.message);
  }
};
