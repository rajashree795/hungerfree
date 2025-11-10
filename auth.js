
/* ============================================================
   HungerFree | Auth System (Final Version with unique IDs)
   ============================================================ */

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const toast = document.getElementById("toast");

// toggle forms
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Toast message helper
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.style.background = type === "error" ? "#e74c3c" : "#00b894";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Unique ID generator
function generateId() {
  return "u_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

// Load / Save users
function getUsers() {
  const data = localStorage.getItem("hf_users_map");
  return data ? JSON.parse(data) : {};
}
function saveUsers(users) {
  localStorage.setItem("hf_users_map", JSON.stringify(users));
}

// Register user
function registerUser(name, email, pass) {
  if (!name || !email || !pass) {
    showToast("⚠️ Please fill all fields!", "error");
    return false;
  }
  const users = getUsers();
  const exists = Object.values(users).find((u) => u.email === email);
  if (exists) {
    showToast("❌ Email already registered!", "error");
    return false;
  }
  const id = generateId();
  users[id] = { id, name, email, pass };
  saveUsers(users);
  showToast("✅ Registered successfully!");
  return true;
}

// Login user
function loginUser(email, pass) {
  if (!email || !pass) {
    showToast("⚠️ Please fill all fields!", "error");
    return false;
  }
  const users = getUsers();
  const found = Object.values(users).find(
    (u) => u.email === email && u.pass === pass
  );
  if (found) {
    localStorage.setItem("hf_logged_in", JSON.stringify(found));
    showToast(`👋 Welcome, ${found.name}!`);
    setTimeout(() => (window.location.href = "index.html"), 1000);
    return true;
  } else {
    showToast("❌ Invalid email or password!", "error");
    return false;
  }
}

// Register form submit
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const pass = document.getElementById("regPass").value;
  if (registerUser(name, email, pass)) {
    registerForm.reset();
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  }
});

// Login form submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;
  loginUser(email, pass);
});

document.addEventListener("DOMContentLoaded", () => {
  const logged = localStorage.getItem("hf_logged_in");
  const loginBtn = document.querySelector(".btn-login");

  if (logged && loginBtn) {
    const user = JSON.parse(logged);
    loginBtn.outerHTML = `
      <div class="nav-user" style="position:relative;">
        <button style="background:none;border:none;font-weight:600;cursor:pointer;">
          👋 ${user.name}
        </button>
        <div id="logout" style="display:none;position:absolute;top:28px;left:0;background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.1);padding:6px 12px;cursor:pointer;">Logout</div>
      </div>
    `;
    const navUser = document.querySelector(".nav-user");
    navUser.addEventListener("mouseenter", () => {
      navUser.querySelector("#logout").style.display = "block";
    });
    navUser.addEventListener("mouseleave", () => {
      navUser.querySelector("#logout").style.display = "none";
    });
    navUser.querySelector("#logout").addEventListener("click", () => {
      localStorage.removeItem("hf_logged_in");
      window.location.reload();
    });
  }});