/*
 * Ajuste somente esta data se quiser mudar a hora em que o conteúdo é liberado.
 * O sufixo -03:00 mantém o horário de Brasília, inclusive para visitantes de outros fusos.
 */
const EVENT_DATE = new Date("2026-10-11T12:00:00-03:00");

const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const experience = document.querySelector("#experience");
const reveal = document.querySelector("#reveal");
const video = document.querySelector("#launch-video");
const videoPlaceholder = document.querySelector("#video-placeholder");
const playButton = document.querySelector("#play-button");
const videoNote = document.querySelector("#video-note");
let hasRevealed = false;
let countdownTimer;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = EVENT_DATE.getTime() - Date.now();

  if (distance <= 0) {
    Object.values(units).forEach((unit) => { unit.textContent = "00"; });
    revealExperience();
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  units.days.textContent = pad(days);
  units.hours.textContent = pad(hours);
  units.minutes.textContent = pad(minutes);
  units.seconds.textContent = pad(seconds);
}

function revealExperience() {
  if (hasRevealed) return;

  hasRevealed = true;
  experience.classList.add("is-revealed");
  reveal.setAttribute("aria-hidden", "false");
  if (countdownTimer) clearInterval(countdownTimer);
}

function startVideo() {
  if (!video.currentSrc) {
    videoNote.textContent = "O vídeo ainda não está disponível. Tente novamente em instantes.";
    return;
  }

  videoPlaceholder.classList.add("is-hidden");
  video.play().catch(() => {
    videoPlaceholder.classList.remove("is-hidden");
    videoNote.textContent = "Não foi possível iniciar o vídeo. Tente novamente.";
  });
}

playButton.addEventListener("click", startVideo);

video.addEventListener("play", () => {
  videoPlaceholder.classList.add("is-hidden");
  videoNote.textContent = "";
});

video.addEventListener("error", () => {
  videoPlaceholder.classList.remove("is-hidden");
  videoNote.textContent = "Não foi possível carregar o vídeo. Tente novamente em instantes.";
});

// Use ?preview=true no endereço para ver a animação final antes da data do evento.
const previewMode = new URLSearchParams(window.location.search).get("preview") === "true";
if (previewMode) {
  revealExperience();
} else {
  countdownTimer = setInterval(updateCountdown, 1000);
  updateCountdown();
}
