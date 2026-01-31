const el = (id) => document.getElementById(id);

function stamp(){
  const d = new Date();
  const pad = (n) => (n < 10 ? "0"+n : ""+n);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function logLine(msg){
  const box = el("logBox");
  const line = `${stamp()} | ${msg}\n`;
  box.textContent = (box.textContent + line).slice(-4000);
  box.scrollTop = box.scrollHeight;
}

function fakeRun(){
  const status = el("statusText");
  const lastRun = el("lastRunText");
  status.textContent = "Running";
  lastRun.textContent = stamp();
  logLine("Starting run");
  let step = 0;

  const steps = [
    "Loading settings",
    "Scanning Recon sheet",
    "Grouping by Vess/Voy",
    "Running role-aware matches",
    "Applying SS/MED constraints",
    "Writing Status back to Recon",
    "Appending Cleared groups",
    "Generating debug trace",
    "Done"
  ];

  const timer = setInterval(() => {
    logLine(steps[Math.min(step, steps.length-1)]);
    if(step === 3){
      el("m1").textContent = "128";
      el("m2").textContent = "121";
      el("m3").textContent = "4";
      el("m4").textContent = "3";
    }
    if(step >= steps.length-1){
      clearInterval(timer);
      status.textContent = "Done";
    }
    step++;
  }, 450);
}

function toggleTheme(){
  document.documentElement.classList.toggle("light");
  const on = document.documentElement.classList.contains("light");
  localStorage.setItem("theme", on ? "light" : "dark");
}

(function init(){
  el("year").textContent = new Date().getFullYear();
  el("fakeRunBtn").addEventListener("click", fakeRun);
  el("themeBtn").addEventListener("click", toggleTheme);

  const saved = localStorage.getItem("theme");
  if(saved === "light") document.documentElement.classList.add("light");

  logLine("Website loaded");
})();