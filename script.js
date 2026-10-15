const stage = document.getElementById("stage");
const message = document.getElementById("message");
const hint = document.getElementById("hint");
const lastEl = document.getElementById("last");
const bestEl = document.getElementById("best");

const BEST_KEY = "reaction-best-ms";

let state = "idle";
let waitTimer = null;
let goAt = 0;
let best = Number(localStorage.getItem(BEST_KEY)) || null;

if (best) {
  bestEl.textContent = best + " ms";
}

function setState(next, text, hintText) {
  state = next;
  stage.className = "stage " + (next === "idle" ? "" : next);
  message.textContent = text;
  hint.textContent = hintText;
}

function startRound() {
  clearTimeout(waitTimer);
  setState("wait", "Wait…", "Click only when the screen turns green.");
  const delay = 1000 + Math.random() * 3000;
  waitTimer = setTimeout(() => {
    goAt = performance.now();
    setState("go", "Click!", "Now.");
  }, delay);
}

function finish(ms) {
  lastEl.textContent = ms + " ms";
  if (best === null || ms < best) {
    best = ms;
    localStorage.setItem(BEST_KEY, String(best));
    bestEl.textContent = best + " ms";
    setState("idle", ms + " ms", "New best. Click to try again.");
    return;
  }
  setState("idle", ms + " ms", "Click to try again.");
}

stage.addEventListener("click", () => {
  if (state === "idle") {
    startRound();
    return;
  }

  if (state === "wait") {
    clearTimeout(waitTimer);
    setState("early", "Too soon", "You clicked before green. Click to try again.");
    state = "idle";
    stage.className = "stage early";
    return;
  }

  if (state === "go") {
    const ms = Math.round(performance.now() - goAt);
    finish(ms);
  }
});
