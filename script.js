(function () {
  const root = document.documentElement;

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme
  const themeBtn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("re_theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("re_theme", next);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Mobile menu toggle with X
  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");

  function setOpen(open) {
    if (!btn || !menu) return;
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
  }

  if (btn && menu) {
    btn.addEventListener("click", () => {
      const isOpen = btn.classList.contains("is-open");
      setOpen(!isOpen);
    });

    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setOpen(false);
    });
  }

  // Demo UI "Run recon" simulation
  const runBtn = document.getElementById("runBtn");
  const uiStatus = document.getElementById("uiStatus");
  const uiLastRun = document.getElementById("uiLastRun");
  const uiMatched = document.getElementById("uiMatched");
  const uiCleared = document.getElementById("uiCleared");
  const uiTol = document.getElementById("uiTol");
  const uiReview = document.getElementById("uiReview");
  const logBox = document.getElementById("logBox");

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function log(line) {
    if (!logBox) return;
    logBox.textContent = `${logBox.textContent}\n${line}`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setText(el, val) {
    if (el) el.textContent = String(val);
  }

  if (logBox) logBox.textContent = `${nowStamp()} | Website loaded`;

  if (runBtn) {
    runBtn.addEventListener("click", () => {
      setText(uiStatus, "Running");
      setText(uiLastRun, nowStamp());
      log(`${nowStamp()} | Running matching rules`);
      log(`${nowStamp()} | Writing statuses`);
      log(`${nowStamp()} | Appending cleared groups`);
      log(`${nowStamp()} | Generating trace output`);

      const matched = 128;
      const cleared = 121;
      const tol = 4;
      const review = 3;

      window.setTimeout(() => {
        setText(uiMatched, matched);
        setText(uiCleared, cleared);
        setText(uiTol, tol);
        setText(uiReview, review);
        setText(uiStatus, "Done");
        log(`${nowStamp()} | Done`);
      }, 450);
    });
  }
})();