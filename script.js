/* =========================
   ELEMENTS
========================= */

const cat = document.getElementById("cat");
const bear = document.getElementById("bear");
const scene = document.getElementById("scene");

/* =========================
   PRELOAD CAUGHT IMAGES
========================= */

const caughtFrames = [
  "assets/caught_1.png",
  "assets/caught_2.png"
];

caughtFrames.forEach(src => {
  const img = new Image();
  img.src = src;
});

/* =========================
   CREATE CAUGHT IMAGE
========================= */

const caughtImg = document.createElement("img");
caughtImg.style.position = "absolute";
caughtImg.style.display = "none";
caughtImg.style.imageRendering = "pixelated";
caughtImg.style.width = "160px";
scene.appendChild(caughtImg);

/* =========================
   HELPERS
========================= */

function getW() { return window.innerWidth; }
function getH() { return window.innerHeight; }

/* =========================
   POSITIONS
========================= */

let catX = 200;
let catY = 200;
let bearX = 50;
let bearY = 50;
let catDX = 1.6;
let catDY = 1.2;

/* =========================
   STATES
========================= */

let running = true;
let bearTired = false;
let finished = false;
let catHeld = false;

/* =========================
   FRAMES
========================= */

const catRunFrames = [
  "assets/cat_run_1.png",
  "assets/cat_run_2.png"
];

const catPetFrames = [
  "assets/cat_pet_1.png",
  "assets/cat_pet_2.png"
];

const bearRunFrames = [
  "assets/bear_run_1.png",
  "assets/bear_run_2.png"
];

let catFrame = 0;
let bearFrame = 0;
let caughtFrame = 0;

/* =========================
   CAT RUN ANIMATION
========================= */

setInterval(() => {
  if (!running || catHeld || finished) return;
  catFrame = (catFrame + 1) % catRunFrames.length;
  cat.src = catRunFrames[catFrame];
}, 170);

/* =========================
   CAT PET ANIMATION
========================= */

setInterval(() => {
  if (!catHeld || finished) return;
  catFrame = (catFrame + 1) % catPetFrames.length;
  cat.src = catPetFrames[catFrame];
}, 250);

/* =========================
   BEAR RUN ANIMATION
========================= */

setInterval(() => {
  if (!running || bearTired || finished) return;
  bearFrame = (bearFrame + 1) % bearRunFrames.length;
  bear.src = bearRunFrames[bearFrame];
}, 200);

/* =========================
   CAT MOVEMENT
========================= */

function moveCat() {

  if (!running || catHeld || finished) {
    requestAnimationFrame(moveCat);
    return;
  }

  catX += catDX;
  catY += catDY;

  if (catX <= 0 || catX >= getW() - 60) catDX *= -1;
  if (catY <= 0 || catY >= getH() - 60) catDY *= -1;

  cat.style.transform =
    `translate(${catX}px, ${catY}px) scaleX(${catDX < 0 ? -1 : 1})`;

  requestAnimationFrame(moveCat);
}

/* =========================
   BEAR CHASE
========================= */

function moveBear() {

  if (!running || finished) {
    requestAnimationFrame(moveBear);
    return;
  }

  if (!bearTired) {
    let dx = catX - bearX;
    let dy = catY - bearY;
    let distance = Math.sqrt(dx*dx + dy*dy);

    if (distance > 1) {
      let moveX = (dx / distance) * 1.6;
      let moveY = (dy / distance) * 1.6;

      bearX += moveX;
      bearY += moveY;

      bear.style.transform =
        `translate(${bearX}px, ${bearY}px) scaleX(${moveX < 0 ? -1 : 1})`;
    }
  }

  if (!finished &&
      Math.abs(bearX - catX) < 28 &&
      Math.abs(bearY - catY) < 28) {
    triggerCaught();
  }

  requestAnimationFrame(moveBear);
}

/* =========================
   BEAR TIRED LOOP
========================= */

setInterval(() => {
  if (!running || finished) return;

  bearTired = true;
  bear.src = "assets/bear_tired.png";

  setTimeout(() => {
    if (!finished) {
      bearTired = false;
      bear.src = bearRunFrames[0];
    }
  }, 900);

}, 7000);

/* =========================
   CAUGHT SEQUENCE (FIXED)
========================= */

function triggerCaught() {

  if (finished) return;

  finished = true;
  running = false;
  catHeld = false;

  cat.style.display = "none";
  bear.style.display = "none";

  caughtImg.style.left = catX + "px";
  caughtImg.style.top = catY + "px";
  caughtImg.style.transform = "none";
  caughtImg.style.display = "block";

  let localFrame = 0;

  const caughtAnim = setInterval(() => {
    localFrame = (localFrame + 1) % caughtFrames.length;

    // Force browser repaint
    caughtImg.src = "";
    setTimeout(() => {
      caughtImg.src = caughtFrames[localFrame];
    }, 10);

  }, 350);

  setTimeout(() => {
    clearInterval(caughtAnim);
    showRestartPopup();
  }, 4000);
}

/* =========================
   LONG PRESS (SMOOTH)
========================= */

let holdTimeout = null;

function startHold() {
  if (finished) return;

  holdTimeout = setTimeout(() => {
    catHeld = true;
  }, 200);
}

function endHold() {
  clearTimeout(holdTimeout);
  if (!finished) catHeld = false;
}

cat.addEventListener("mousedown", startHold);
cat.addEventListener("mouseup", endHold);
cat.addEventListener("mouseleave", endHold);
cat.addEventListener("touchstart", startHold);
cat.addEventListener("touchend", endHold);

/* =========================
   RESTART POPUP
========================= */

function showRestartPopup() {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.4)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "999";

  const popup = document.createElement("div");
  popup.style.background = "#ffe4ec";
  popup.style.padding = "40px 50px";
  popup.style.borderRadius = "20px";
  popup.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
  popup.style.textAlign = "center";
  popup.style.fontFamily = "'Poppins', sans-serif";
  popup.style.minWidth = "300px";

  popup.innerHTML = `
    <h1 style="
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      margin-bottom: 20px;
      color: #3a2b2b;
    ">
      Happy Birthday! 🐻🐱
    </h1>

    <div style="display:flex; gap:20px; justify-content:center;">

      <button id="restartBtn" class="giftBtn">
        🎁 Restart
      </button>

      <button id="surpriseBtn" class="giftBtn">
        🎁 Another Surprise
      </button>

    </div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("restartBtn").onclick = () => {
    location.reload();
  };

  document.getElementById("surpriseBtn").onclick = () => {
    openVideoModal();
  };
}

/* =========================
   VIDEO MODAL
========================= */

function openVideoModal() {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.75)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";

  const modal = document.createElement("div");
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  modal.innerHTML = `
    <video controls autoplay style="
      max-width: 80vw;
      max-height: 80vh;
      border-radius: 20px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.4);
      background: black;
    ">
      <source src="assets/surprise.mp4" type="video/mp4">
    </video>

    <button id="closeVideo" style="
      margin-top: 20px;
      padding: 10px 20px;
      border-radius: 12px;
      border: none;
      background: #ff8fa3;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
    ">
      Close
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById("closeVideo").onclick = () => {
    document.body.removeChild(overlay);
  };
}

/* =========================
   START
========================= */

moveCat();
moveBear();