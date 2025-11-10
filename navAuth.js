/* ============================================================
   HungerFree | Navbar Auth Sync (Fixed Hover + Arrow Dropdown)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".btn-login");

  const logged = localStorage.getItem("hf_logged_in");
  if (logged && loginBtn) {
    const user = JSON.parse(logged);

    // Replace login with profile dropdown
    loginBtn.outerHTML = `
      <div class="nav-user" style="position:relative;display:flex;align-items:center;">
        <button class="user-btn" 
                style="background:linear-gradient(90deg,rgba(0,184,148,0.15),rgba(85,239,196,0.25));
                       border:none;padding:8px 14px;border-radius:999px;
                       font-weight:600;color:#083a33;cursor:pointer;
                       display:flex;align-items:center;gap:6px;
                       transition:all 0.3s ease;">
          👋 ${user.name}
        </button>

        <div id="logout"
             style="position:absolute;top:50px;left:0;background:#fff;border-radius:10px;
                    box-shadow:0 6px 24px rgba(0,0,0,0.1);padding:10px 16px;
                    color:#083a33;font-weight:600;min-width:120px;text-align:center;
                    opacity:0;pointer-events:none;transform:translateY(-4px);
                    transition:all 0.3s ease; cursor: pointer;">
          <div class="arrow" style="position:absolute;top:-6px;left:20px;width:0;height:0;
                                     border-left:6px solid transparent;
                                     border-right:6px solid transparent;
                                     border-bottom:6px solid #fff;"></div>
          Logout
        </div>
      </div>
    `;

    const navUser = document.querySelector(".nav-user");
    const logoutBtn = navUser.querySelector("#logout");
    const userBtn = navUser.querySelector(".user-btn");

    // hover handling (keeps open when hovering dropdown)
    let hoverTimeout;

    function showDropdown() {
      clearTimeout(hoverTimeout);
      logoutBtn.style.opacity = "1";
      logoutBtn.style.pointerEvents = "auto";
      logoutBtn.style.transform = "translateY(6px)";
    }

    function hideDropdown() {
      hoverTimeout = setTimeout(() => {
        logoutBtn.style.opacity = "0";
        logoutBtn.style.pointerEvents = "none";
        logoutBtn.style.transform = "translateY(-4px)";
      }, 200);
    }

    userBtn.addEventListener("mouseenter", showDropdown);
    userBtn.addEventListener("mouseleave", hideDropdown);
    logoutBtn.addEventListener("mouseenter", showDropdown);
    logoutBtn.addEventListener("mouseleave", hideDropdown);

    // Click logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("hf_logged_in");
      location.reload();
    });

    // Add hover animation for the username
    userBtn.addEventListener("mouseenter", () => {
      userBtn.style.background =
        "linear-gradient(90deg,rgba(0,184,148,0.25),rgba(85,239,196,0.35))";
      userBtn.style.transform = "translateY(-2px)";
    });
    userBtn.addEventListener("mouseleave", () => {
      userBtn.style.background =
        "linear-gradient(90deg,rgba(0,184,148,0.15),rgba(85,239,196,0.25))";
      userBtn.style.transform = "translateY(0)";
    });
  }
});
