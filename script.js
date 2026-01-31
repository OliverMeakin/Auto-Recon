l(() => {
  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);

  function pad2(n){ return String(n).padStart(2, "0"); }
  function formatTS(d){
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    const ss = pad2(d.getSeconds());
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  function lerp(a, b, t){ return a + (b - a) * t; }

  function animateNumber(el, from, to, durationMs, opts = {}) {
    const start = performance.now();
    const ease = opts.ease || ((x) => 1 - Math.pow(1 - x, 3)); // easeOutCubic

    return new Promise(resolve => {
      function frame(now){
        const t = Math.min(1, (now - start) / durationMs);
        const v = Math.round(lerp(from, to, ease(t)));
        el.textContent = String(v);
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  // ---------- theme toggle ----------
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

  // ---------- mobile menu ----------
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const open = !menuBtn.classList.contains("is-open");
      menuBtn.classList.toggle("is-open", open);
      mobileMenu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      // close after navigation
      menuBtn.classList.remove("is-open");
      mobileMenu.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    });
  }

  // ---------- demo run ----------
  const runBtn = $("#runBtn");
  const logBox = $("#logBox");
  const statusEl = $("#demoStatus");
  const lastRunEl = $("#demoLastRun");

  const matchedEl = $("#statMatched");
  const clearedEl = $("#statCleared");
  const tolEl = $("#statTol");
  const reviewEl = $("#statReview");

  let isRunning = false;

  // Starting values (what you show when page loads)
  const initial = {
    matched: Number(matchedEl?.textContent || 0),
    cleared: Number(clearedEl?.textContent || 0),
    tol: Number(tolEl?.textContent || 0),
    review: Number(reviewEl?.textContent || 0),
  };

  // Target values (feel free to tweak)
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
    if (statusEl) statusEl.textContent = text;
  }

  function setLastRun(ts) {
    if (lastRunEl) lastRunEl.textContent = ts;
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

    const start = new Date();
    setStatus("Running");
    setBtnRunning(true);

    // wipe log and write a realistic sequence
    if (logBox) logBox.textContent = "";
    appendLog(`${formatTS(start)} | Run started`);
    await sleep(650);

    // Slight “thinking” pause
    appendLog(`${formatTS(new Date())} | Loading configuration`);
    await sleep(700);

    appendLog(`${formatTS(new Date())} | Scanning rows and indexing candidates`);
    await sleep(800);

    // Start number animations in a staged way so it feels procedural
    // Phase A: matched climbs first
    const matchedFrom = initial.matched || 0;
    const clearedFrom = initial.cleared || 0;
    const tolFrom = initial.tol || 0;
    const reviewFrom = initial.review || 0;

    // Reset displayed stats at the start of each run (optional)
    if (matchedEl) matchedEl.textContent = String(0);
    if (clearedEl) clearedEl.textContent = String(0);
    if (tolEl) tolEl.textContent = String(0);
    if (reviewEl) reviewEl.textContent = String(0);

    // Use a slightly longer duration so it doesn't look instant
    const a1 = animateNumber(matchedEl, 0, targets.matched, 2200);
    await sleep(350);

    appendLog(`${formatTS(new Date())} | Applying match rules`);
    await sleep(650);

    const a2 = animateNumber(clearedEl, 0, targets.cleared, 1800);
    await sleep(300);

    appendLog(`${formatTS(new Date())} | Appending cleared groups to audit log`);
    await sleep(650);

    const a3 = animateNumber(tolEl, 0, targets.tol, 900);
    await sleep(250);

    appendLog(`${formatTS(new Date())} | Flagging tolerance items`);
    await sleep(500);

    const a4 = animateNumber(reviewEl, 0, targets.review, 900);

    await Promise.all([a1, a2, a3, a4]);

    appendLog(`${formatTS(new Date())} | Generating trace output`);
    await sleep(650);

    appendLog(`${formatTS(new Date())} | Done`);

    const end = new Date();
    setStatus("Done");
    setLastRun(formatTS(end));

    // Update initial baseline to current (so subsequent runs look consistent)
    initial.matched = targets.matched;
    initial.cleared = targets.cleared;
    initial.tol = targets.tol;
    initial.review = targets.review;

    setBtnRunning(false);
    isRunning = false;
  }

  if (runBtn) {
    runBtn.addEventListener("click", runDemo);
  }

  // Optional: set last run placeholder on load
  if (lastRunEl && !lastRunEl.textContent.trim()) {
    lastRunEl.textContent = "—";
  }
})();