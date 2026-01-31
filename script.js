(() => {
  // ---------------- helpers ----------------
  const $ = (sel, root = document) => root.querySelector(sel);

  function pad2(n) { return String(n).padStart(2, "0"); }

  function formatTS(d) {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    const ss = pad2(d.getSeconds());
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateNumber(el, from, to, durationMs, opts = {}) {
    if (!el) return Promise.resolve();
    const start = performance.now();
    const ease = opts.ease || ((x) => 1 - Math.pow(1 - x, 3)); // easeOutCubic

    return new Promise(resolve => {
      function frame(now) {
        const t = Math.min(1, (now - start) / durationMs);
        const v = Math.round(lerp(from, to, ease(t)));
        el.textContent = String(v);
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  // ---------------- footer year ----------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------- theme toggle ----------------
  const themeBtn = $("#themeBtn");
  if (themeBtn) {
    const saved = localStorage.getItem("recon_theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }

    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("recon_theme", next);
    });
  }

  // ---------------- mobile menu toggle ----------------
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");

  if (navToggle && mobileMenu) {
    function setMenuOpen(open) {
      navToggle.classList.toggle("is-open", open);
      mobileMenu.hidden = !open;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    navToggle.addEventListener("click", () => {
      const open = !navToggle.classList.contains("is-open");
      setMenuOpen(open);
    });

    // close menu when clicking any mobile link
    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setMenuOpen(false);
    });

    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navToggle.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });
  }

  // ---------------- demo run ----------------
  const runBtn = $("#runBtn");
  const logBox = $("#logBox");

  const uiStatus = $("#uiStatus");
  const uiLastRun = $("#uiLastRun");

  const uiMatched = $("#uiMatched");
  const uiCleared = $("#uiCleared");
  const uiTol = $("#uiTol");
  const uiReview = $("#uiReview");

  let isRunning = false;

  const targets = {
    matched: 128,
    cleared: 121,
    tol: 4,
    review: 3,
  };

  function appendLog(line) {
    if (!logBox) return;
    logBox.textContent += (logBox.textContent ? "\n" : "") + line;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setStatus(text) {
    if (uiStatus) uiStatus.textContent = text;
  }

  function setLastRun(ts) {
    if (uiLastRun) uiLastRun.textContent = ts;
  }

  function setBtnRunning(running) {
    if (!runBtn) return;
    runBtn.disabled = running;
    runBtn.setAttribute("aria-disabled", String(running));
    runBtn.textContent = running ? "Running…" : "Run recon";
  }

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;

    // reset UI
    setBtnRunning(true);
    setStatus("Running");

    if (uiMatched) uiMatched.textContent = "0";
    if (uiCleared) uiCleared.textContent = "0";
    if (uiTol) uiTol.textContent = "0";
    if (uiReview) uiReview.textContent = "0";

    if (logBox) logBox.textContent = "";

    const start = new Date();
    appendLog(`${formatTS(start)} | Run started`);
    await sleep(650);

    appendLog(`${formatTS(new Date())} | Loading configuration`);
    await sleep(700);

    appendLog(`${formatTS(new Date())} | Scanning rows and indexing candidates`);
    await sleep(850);

    appendLog(`${formatTS(new Date())} | Applying match rules`);
    await sleep(650);

    // animate counters in a staged sequence so it feels real
    const a1 = animateNumber(uiMatched, 0, targets.matched, 2400);
    await sleep(350);

    appendLog(`${formatTS(new Date())} | Writing statuses back to export`);
    await sleep(650);

    const a2 = animateNumber(uiCleared, 0, targets.cleared, 1900);
    await sleep(250);

    appendLog(`${formatTS(new Date())} | Appending cleared groups to audit log`);
    await sleep(650);

    const a3 = animateNumber(uiTol, 0, targets.tol, 900);
    await sleep(250);

    appendLog(`${formatTS(new Date())} | Flagging tolerance items`);
    await sleep(450);

    const a4 = animateNumber(uiReview, 0, targets.review, 900);

    await Promise.all([a1, a2, a3, a4]);

    appendLog(`${formatTS(new Date())} | Generating trace output`);
    await sleep(650);

    appendLog(`${formatTS(new Date())} | Done`);

    const end = new Date();
    setStatus("Done");
    setLastRun(formatTS(end));

    setBtnRunning(false);
    isRunning = false;
  }

  if (runBtn) runBtn.addEventListener("click", runDemo);

  // Optional: on load, ensure last run is a dash
  if (uiLastRun && !uiLastRun.textContent.trim()) uiLastRun.textContent = "—";
})();