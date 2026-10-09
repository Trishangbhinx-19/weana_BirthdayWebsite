const openBtn = document.getElementById("openBtn");
const confettiBtn = document.getElementById("confettiBtn");
const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("bgMusic");
const scrollProgress = document.getElementById("scrollProgress");
const dotNav = document.getElementById("dotNav");
const sectionIds = ["home", "birthday", "chaos", "memories", "letter", "openwhen", "final"];

function reveal(id) {
  const section = document.getElementById(id);
  section.classList.remove("hidden");
  section.classList.add("reveal");
}

openBtn.addEventListener("click", () => {
  reveal("birthday");
  reveal("chaos");
  reveal("memories");
  reveal("letter");
  reveal("openwhen");
  reveal("final");
  buildDots();
  setupScratchCards();

  document.getElementById("birthday").scrollIntoView({ behavior: "smooth" });
  burstConfetti(100);

  // Browsers allow audio after a user click.
  music.play().catch(() => {});
});

confettiBtn.addEventListener("click", () => {
  burstConfetti(180);
  const message = document.getElementById("finalMessage");
  message.classList.add("show");
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch(() => {
      alert("Add your MP3 file to the music folder first.");
    });
    musicBtn.textContent = "♫";
  } else {
    music.pause();
    musicBtn.textContent = "🔇";
  }
});

function burstConfetti(amount) {
  const symbols = ["♥", "✦", "✧", "•", "★"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.fontSize = (8 + Math.random() * 16) + "px";
    piece.style.animationDelay = Math.random() * .7 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 3500);
  }
}

function previewPhoto(event, label) {
  const file = event.target.files[0];
  if (!file) return;

  const img = label.querySelector("img");
  img.src = URL.createObjectURL(file);
  label.classList.add("has-photo");
}

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close image">&times;</button>
  <img class="lightbox-image" alt="Expanded memory">
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const closeLightbox = () => lightbox.classList.remove("open");

document.querySelectorAll(".photo-slot img").forEach((image) => {
  image.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
  });
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.classList.contains("lightbox-close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Sidebar dot navigation
function buildDots() {
  if (dotNav.classList.contains("built")) return;
  dotNav.classList.add("built");

  sectionIds.forEach((id) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to " + id.replace("-", " "));
    dot.addEventListener("click", () => {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    });
    dotNav.appendChild(dot);
  });

  dotNav.classList.add("visible");
  onScroll();
}

// Scroll progress bar + active section highlight
function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const progress = max > 0 ? doc.scrollTop / max : 0;
  scrollProgress.style.width = progress * 100 + "%";

  const dots = dotNav.querySelectorAll(".dot");
  const midpoint = window.innerHeight / 2;
  sectionIds.forEach((id, index) => {
    const section = document.getElementById(id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top <= midpoint && rect.bottom >= midpoint) {
      dots.forEach((dot) => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

// Music button pulse while playing
music.addEventListener("play", () => musicBtn.classList.add("playing"));
music.addEventListener("pause", () => musicBtn.classList.remove("playing"));

// Gift boxes: click to reveal message
document.querySelectorAll(".gift-box").forEach((box) => {
  box.addEventListener("click", () => {
    const open = box.classList.toggle("open");
    box.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

// Open-when cards: click to flip
document.querySelectorAll(".open-card").forEach((card) => {
  card.addEventListener("click", () => {
    const open = card.classList.toggle("open");
    card.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

// Memory jar: shake and pull a random memory
const jarBtn = document.getElementById("jarBtn");
const jarMemory = document.getElementById("jarMemory");

const memories = [
  "Tong sa CL nato nga time pag grade 7 nga nanghilak ta then gi invite ko nimo nga mopalit og ice water HUHUH, that's when I knew nga I foung my jumega.",
  "Kahibaw ba ka nga na favourite na nakong burger because sige ko nimog libre ana pag grade 7? HAHAHAHA",
  "And I was thankful nga gi choose jud nako nga sa SIA mo Junior High, kay nakaila tika.",
  "The day nga niuna ka og tagad nako pag Grade 7, thank you kaayo kay lonely baya jud ko ato then I didnt expect nga naay mouna og tagad nako kay introvert kayko sauna nga louran HAHAHHA. 🫶",
  "Speaking of louran HAHAHAAHAH, salamat diay kay gi spoil ko nimo nga permi soyuon og mangluod HAHAHAHAHA.",
  "All the libre weana since grade 7, nakaingon baya jud ko ato nga milyonaryo mn guro ni siya HAHAHAHAHA",
  "Ss time nga gamaoy ko, kahibaw naka kinsa to, naa jud ka permi para i real talk ko that's why hantud ron natauhan nako HAHAHAH char tagaleg.",
  "Kadtong pag Christmas Party nga instead mangaon sa room, nag burger nuon sa Angel's burger. 😭"
];

let lastMemory = -1;

jarBtn.addEventListener("click", () => {
  jarBtn.classList.remove("shaking");
  void jarBtn.offsetWidth;
  jarBtn.classList.add("shaking");

  let index;
  do {
    index = Math.floor(Math.random() * memories.length);
  } while (index === lastMemory && memories.length > 1);
  lastMemory = index;

  jarMemory.classList.remove("show");
  void jarMemory.offsetWidth;
  jarMemory.textContent = memories[index];
  jarMemory.classList.add("show");
});

// Scratch-to-reveal cards
function setupScratchCard(card) {
  if (card.dataset.ready) return;
  const canvas = card.querySelector(".scratch-canvas");
  if (!canvas) return;
  const rect = card.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;

  card.dataset.ready = "1";
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#b56cff");
  gradient.addColorStop(1, "#7048d8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.fillStyle = "rgba(255,255,255,.8)";
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.font = "700 15px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✨ Scratch me ✨", rect.width / 2, rect.height / 2);

  const radius = 26;
  let scratching = false;
  let revealed = false;

  const pos = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const erase = (x, y) => {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = () => {
    if (revealed) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 50) {
      total++;
      if (data[i] < 40) cleared++;
    }
    if (total && cleared / total > 0.55) {
      revealed = true;
      canvas.style.transition = "opacity .5s ease";
      canvas.style.opacity = "0";
      setTimeout(() => canvas.remove(), 520);
    }
  };

  canvas.addEventListener("pointerdown", (event) => {
    scratching = true;
    canvas.setPointerCapture(event.pointerId);
    const p = pos(event);
    erase(p.x, p.y);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!scratching || revealed) return;
    const p = pos(event);
    erase(p.x, p.y);
    checkReveal();
  });

  const stopScratch = () => {
    scratching = false;
    checkReveal();
  };

  canvas.addEventListener("pointerup", stopScratch);
  canvas.addEventListener("pointercancel", stopScratch);
  canvas.addEventListener("pointerleave", () => {
    scratching = false;
  });
}

function setupScratchCards() {
  document.querySelectorAll(".scratch-card").forEach((card) => {
    let attempts = 0;
    const trySetup = () => {
      const rect = card.getBoundingClientRect();
      if (rect.width < 10) {
        if (attempts++ < 20) requestAnimationFrame(trySetup);
        return;
      }
      setupScratchCard(card);
    };
    requestAnimationFrame(trySetup);
  });
}

// Animated number counters for the friendship stats
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);

        const num = entry.target.querySelector(".stat-num");
        if (entry.target.classList.contains("stat") && num) {
          countUp(num);
        }
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal-item").forEach((el) => revealObserver.observe(el));

// ---------------------------------------------------------------------------
// Ambient effects: starfield, cursor glow, sparkle trail, shooting stars
// ---------------------------------------------------------------------------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (!reduceMotion) {
  // Twinkling starfield covering the viewport
  const starfield = document.getElementById("starfield");
  const starColors = ["#ffffff", "#d8b8ff", "#ff9de2", "#a979ff"];
  const starCount = window.innerWidth < 640 ? 40 : 90;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("span");
    star.className = "star";
    const size = Math.random() * 2.4 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.background = starColors[Math.floor(Math.random() * starColors.length)];
    star.style.setProperty("--dur", (2 + Math.random() * 4) + "s");
    star.style.setProperty("--delay", (Math.random() * 5) + "s");
    star.style.setProperty("--max", (0.4 + Math.random() * 0.6).toFixed(2));
    starfield.appendChild(star);
  }

  // Soft glow + sparkle trail that follows the cursor
  if (finePointer) {
    const cursorGlow = document.getElementById("cursorGlow");
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;
    let lastSpark = 0;

    function spawnCursorSparkle(x, y) {
      const spark = document.createElement("span");
      spark.className = "cursor-sparkle";
      spark.textContent = Math.random() > .5 ? "✦" : "♥";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.fontSize = (8 + Math.random() * 10) + "px";
      spark.style.color = Math.random() > .5 ? "#d8b8ff" : "#ff9de2";
      spark.style.setProperty("--dx", (Math.random() * 40 - 20) + "px");
      spark.style.setProperty("--dy", (10 + Math.random() * 30) + "px");
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 900);
    }

    window.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.classList.add("active");

      const now = performance.now();
      if (now - lastSpark > 60) {
        lastSpark = now;
        spawnCursorSparkle(event.clientX, event.clientY);
      }
    });

    document.addEventListener("mouseleave", () => cursorGlow.classList.remove("active"));

    (function followCursor() {
      glowX += (targetX - glowX) * 0.14;
      glowY += (targetY - glowY) * 0.14;
      cursorGlow.style.transform = "translate(" + glowX + "px, " + glowY + "px)";
      requestAnimationFrame(followCursor);
    })();
  }

  // Occasional shooting stars
  setInterval(() => {
    if (document.hidden || Math.random() < 0.4) return;
    const star = document.createElement("span");
    star.className = "shooting-star";
    star.style.left = Math.random() * 60 + "vw";
    star.style.top = (-10 + Math.random() * 20) + "vh";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1900);
  }, 4500);
}

// Floating hearts, stars, balloons and cake
const floatingSymbols = ["✦", "♥", "★", "✧", "•", "🎈", "🎂", "🎁", "💜"];

setInterval(() => {
  const p = document.createElement("span");
  p.className = "particle";
  p.textContent = floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.bottom = "-30px";
  p.style.fontSize = (10 + Math.random() * 16) + "px";
  p.style.color = Math.random() > .5 ? "#d8b8ff" : "#a979ff";
  p.style.animationDuration = (6 + Math.random() * 7) + "s";
  document.getElementById("particles").appendChild(p);
  setTimeout(() => p.remove(), 14000);
}, 600);
