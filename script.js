(function () {
  const root = document.documentElement;

  // -------- Theme ----------
  const themeBtn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || "dark";
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  // -------- Mobile nav ----------
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const open = mobileMenu.hidden === false;
      mobileMenu.hidden = open;
      navToggle.setAttribute("aria-expanded", String(!open));
    });

    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (mobileMenu.hidden) return;
      if (navToggle.contains(e.target) || mobileMenu.contains(e.target)) return;
      closeMenu();
    });
  }

  // -------- App preview demo ----------
  const statusText = document.getElementById("statusText");
  const lastRunText = document.getElementById("lastRunText");
  const m1 = document.getElementById("m1");
  const m2 = document.getElementById("m2");
  const m3 = document.getElementById("m3");
  const m4 = document.getElementById("m4");
  const fakeRunBtn = document.getElementById("fakeRunBtn");
  const logBox = document.getElementById("logBox");

  function pad(n) { return String(n).padStart(2, "0"); }
  function nowStamp() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function log(line) {
    if (!logBox) return;
    const text = logBox.textContent ? logBox.textContent + "\n" : "";
    logBox.textContent = text + line;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setCounts(a, b, c, d) {
    if (m1) m1.textContent = String(a);
    if (m2) m2.textContent = String(b);
    if (m3) m3.textContent = String(c);
    if (m4) m4.textContent = String(d);
  }

  function setStatus(s) {
    if (statusText) statusText.textContent = s;
  }

  function setLastRun() {
    if (lastRunText) lastRunText.textContent = nowStamp();
  }

  // Initial demo log
  if (logBox && logBox.textContent.trim() === "") {
    log(`${nowStamp()} | Website loaded`);
  }

  if (fakeRunBtn) {
    fakeRunBtn.addEventListener("click", async () => {
      fakeRunBtn.disabled = true;
      setStatus("Running");
      log(`${nowStamp()} | Initializing run`);
      await new Promise(r => setTimeout(r, 500));

      log(`${nowStamp()} | Loading workbook data`);
      await new Promise(r => setTimeout(r, 700));

      log(`${nowStamp()} | Applying match rules`);
      await new Promise(r => setTimeout(r, 800));

      log(`${nowStamp()} | Writing statuses`);
      await new Promise(r => setTimeout(r, 650));

      log(`${nowStamp()} | Appending cleared log`);
      await new Promise(r => setTimeout(r, 650));

      // Deterministic-ish demo numbers
      const matched = 128;
      const cleared = 121;
      const tol = 4;
      const review = 3;

      setCounts(matched, cleared, tol, review);
      setLastRun();
      setStatus("Done");
      log(`${nowStamp()} | Done`);

      fakeRunBtn.disabled = false;
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();