/* =========================
   ELEMENTS
========================= */

const cat = document.getElementById("cat");
const bear = document.getElementById("bear");

/* =========================
   CREATE CAUGHT IMAGE ELEMENT
   This will replace both characters
========================= */

const caughtImg = document.createElement("img");
caughtImg.style.position = "absolute";
caughtImg.style.display = "none";
caughtImg.style.imageRendering = "pixelated";
caughtImg.style.width = "140px"; // adjust if needed
document.getElementById("scene").appendChild(caughtImg);


/* =========================
   SCREEN HELPERS
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


/* =========================
   FRAMES
========================= */

const catRunFrames = [
  "assets/cat_run_1.png",
  "assets/cat_run_2.png"
];

const bearRunFrames = [
  "assets/bear_run_1.png",
  "assets/bear_run_2.png"
];

const caughtFrames = [
  "assets/caught_1.png",
  "assets/caught_2.png"
];

let catFrame = 0;
let bearFrame = 0;
let caughtFrame = 0;


/* =========================
   ANIMATION INTERVALS
========================= */

const catInterval = setInterval(() => {
  if (!running) return;
  catFrame = (catFrame + 1) % catRunFrames.length;
  cat.src = catRunFrames[catFrame];
}, 170);

const bearInterval = setInterval(() => {
  if (!running || bearTired) return;
  bearFrame = (bearFrame + 1) % bearRunFrames.length;
  bear.src = bearRunFrames[bearFrame];
}, 200);


/* =========================
   CAT MOVEMENT
========================= */

function moveCat() {
  if (!running) return;

  catX += catDX;
  catY += catDY;

  if (catX <= 0 || catX >= getW() - 60) catDX *= -1;
  if (catY <= 0 || catY >= getH() - 60) catDY *= -1;

  // Flip based on direction
  if (catDX < 0) {
    cat.style.transform = `translate(${catX}px, ${catY}px) scaleX(-1)`;
  } else {
    cat.style.transform = `translate(${catX}px, ${catY}px) scaleX(1)`;
  }

  requestAnimationFrame(moveCat);
}


/* =========================
   BEAR CHASE
========================= */

function moveBear() {
  if (!running) return;

  if (!bearTired) {
    let dx = catX - bearX;
    let dy = catY - bearY;
    let distance = Math.sqrt(dx*dx + dy*dy);

    if (distance > 1) {
      let moveX = (dx / distance) * 1.4;
      let moveY = (dy / distance) * 1.4;

      bearX += moveX;
      bearY += moveY;

      // Flip bear depending on movement direction
      if (moveX < 0) {
        bear.style.transform = `translate(${bearX}px, ${bearY}px) scaleX(-1)`;
      } else {
        bear.style.transform = `translate(${bearX}px, ${bearY}px) scaleX(1)`;
      }
    }
  }

  // Catch detection
  if (!finished &&
      Math.abs(bearX - catX) < 30 &&
      Math.abs(bearY - catY) < 30) {
    triggerCaught();
  }

  requestAnimationFrame(moveBear);
}


/* =========================
   BEAR TIRED EVERY 3 SEC
========================= */

setInterval(() => {
  if (!running) return;

  bearTired = true;
  bear.src = "assets/bear_tired.png";

  setTimeout(() => {
    if (running) {
      bearTired = false;
      bear.src = bearRunFrames[0];
    }
  }, 1000);

}, 3000);


/* =========================
   CAUGHT SEQUENCE
========================= */

function triggerCaught() {
  finished = true;
  running = false;

  // Stop intervals
  clearInterval(catInterval);
  clearInterval(bearInterval);

  // Hide original characters
  cat.style.display = "none";
  bear.style.display = "none";

  // Position caught image at cat location
  caughtImg.style.left = catX + "px";
  caughtImg.style.top = catY + "px";
  caughtImg.style.display = "block";

  caughtImg.src = caughtFrames[0];

  const caughtAnim = setInterval(() => {
    caughtFrame = (caughtFrame + 1) % caughtFrames.length;
    caughtImg.src = caughtFrames[caughtFrame];
  }, 400);

  setTimeout(() => {
    clearInterval(caughtAnim);
    showRestartPopup();
  }, 4000);
}


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
  modal.style.position = "relative";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  modal.innerHTML = `
    <video id="birthdayVideo" controls autoplay style="
      max-width: 80vw;
      max-height: 80vh;
      width: auto;
      height: auto;
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
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s ease";
  setTimeout(() => overlay.style.opacity = "1", 10);

  document.getElementById("closeVideo").onclick = () => {
    document.body.removeChild(overlay);
  };
}


/* =========================
   START
========================= */

moveCat();
moveBear();