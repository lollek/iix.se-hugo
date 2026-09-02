const distanceInput = document.querySelector("#race-distance");
const hoursInput = document.querySelector("#race-hours");
const minutesInput = document.querySelector("#race-minutes");
const secondsInput = document.querySelector("#race-seconds");
const vdotSlider = document.querySelector("#vdot-slider");
const vdotInput = document.querySelector("#vdot-input");
const predictionModelInputs = document.querySelectorAll('input[name="prediction-model"]');
const intervalModelInputs = document.querySelectorAll('input[name="interval-model"]');
const predictionExplanations = document.querySelectorAll("[data-prediction-explanation]");
const riegelExponentControl = document.querySelector("#riegel-exponent-control");
const riegelExponentInput = document.querySelector("#riegel-exponent");
const message = document.querySelector("#input-message");
const results = document.querySelector("#prediction-results");
const nsmResults = document.querySelector("#nsm-results");

const distances = [
  ["1,500 m", 1500],
  ["1 mile", 1609.344],
  ["3 km", 3000],
  ["5 km", 5000],
  ["10 km", 10000],
  ["Half marathon", 21097.5],
  ["Marathon", 42195],
];

const nsmWorkouts = [
  ["3 x 10 min", "150-minute race pace", 150],
  ["5 x 6 min", "90-minute race pace", 90],
  ["8 x 3 min", "60-minute race pace", 60],
];

function oxygenCost(speed) {
  return -4.6 + 0.182258 * speed + 0.000104 * speed ** 2;
}

function percentMaxOxygen(duration) {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * duration) + 0.2989558 * Math.exp(-0.1932605 * duration);
}

function vdotFor(distance, duration) {
  return oxygenCost(distance / duration) / percentMaxOxygen(duration);
}

function speedFor(vdot, duration) {
  const oxygen = vdot * percentMaxOxygen(duration);
  return (-0.182258 + Math.sqrt(0.182258 ** 2 - 4 * 0.000104 * (-4.6 - oxygen))) / (2 * 0.000104);
}

function durationFor(distance, vdot) {
  let lower = 1;
  let upper = 1000;

  for (let iteration = 0; iteration < 60; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (vdotFor(distance, midpoint) > vdot) {
      lower = midpoint;
    } else {
      upper = midpoint;
    }
  }

  return (lower + upper) / 2;
}

function riegelDurationFor(sourceDistance, sourceDuration, targetDistance, exponent) {
  return sourceDuration * (targetDistance / sourceDistance) ** exponent;
}

function riegelPaceFor(sourceDistance, sourceDuration, targetDuration, exponent) {
  const targetDistance = sourceDistance * (targetDuration / sourceDuration) ** (1 / exponent);
  return targetDuration / (targetDistance / 1000);
}

function formatDuration(duration) {
  const totalSeconds = Math.round(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updatePredictions() {
  const vdot = Number(vdotSlider.value);
  const riegelExponent = Number(riegelExponentInput.value);
  const sourceDistance = Number(distanceInput.value);
  const sourceDuration = Number(hoursInput.value) * 60 + Number(minutesInput.value) + Number(secondsInput.value) / 60;
  const predictionModel = document.querySelector('input[name="prediction-model"]:checked').value;
  const intervalModel = document.querySelector('input[name="interval-model"]:checked').value;
  vdotInput.value = vdot.toFixed(1);
  riegelExponentControl.hidden = predictionModel !== "riegel" && intervalModel !== "riegel";
  predictionExplanations.forEach((explanation) => {
    explanation.hidden = explanation.dataset.predictionExplanation !== predictionModel;
  });

  results.replaceChildren(...distances.map(([label, distance]) => {
    const duration = predictionModel === "daniels"
      ? durationFor(distance, vdot)
      : riegelDurationFor(sourceDistance, sourceDuration, distance, riegelExponent);
    const row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${label}</th><td>${formatDuration(duration / (distance / 1000))}</td><td>${formatDuration(duration)}</td>`;
    return row;
  }));

  nsmResults.replaceChildren(...nsmWorkouts.map(([workout, reference, duration]) => {
    const pace = intervalModel === "daniels"
      ? 1000 / speedFor(vdot, duration)
      : riegelPaceFor(sourceDistance, sourceDuration, duration, riegelExponent);
    const row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${workout}</th><td>${reference}</td><td>${formatDuration(pace)}</td>`;
    return row;
  }));
}

function updateFromResult() {
  const hours = Number(hoursInput.value);
  const minutes = Number(minutesInput.value);
  const seconds = Number(secondsInput.value);
  const distance = Number(distanceInput.value);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds) || hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59 || hours + minutes / 60 + seconds / 3600 <= 0) {
    message.textContent = "Enter a valid race time with minutes and seconds from 0 to 59.";
    return;
  }

  const vdot = vdotFor(distance, hours * 60 + minutes + seconds / 60);
  if (vdot < Number(vdotSlider.min) || vdot > Number(vdotSlider.max)) {
    message.textContent = `This result produces VDOT ${vdot.toFixed(1)}, outside this calculator's 20.0-85.0 range.`;
    return;
  }

  message.textContent = "";
  vdotSlider.value = vdot.toFixed(1);
  updatePredictions();
}

function updateFromVdotInput() {
  const vdot = Number(vdotInput.value);

  if (!Number.isFinite(vdot) || vdot < Number(vdotSlider.min) || vdot > Number(vdotSlider.max)) {
    message.textContent = "Enter a VDOT from 20.0 to 85.0.";
    return;
  }

  message.textContent = "";
  vdotSlider.value = vdot.toFixed(1);
  updatePredictions();
}

function updateFromRiegelExponent() {
  const exponent = Number(riegelExponentInput.value);

  if (!Number.isFinite(exponent) || exponent < Number(riegelExponentInput.min) || exponent > Number(riegelExponentInput.max)) {
    message.textContent = "Enter a Riegel exponent from 1.00 to 1.20.";
    return;
  }

  message.textContent = "";
  updatePredictions();
}

[distanceInput, hoursInput, minutesInput, secondsInput].forEach((input) => input.addEventListener("input", updateFromResult));
vdotSlider.addEventListener("input", () => {
  message.textContent = "";
  updatePredictions();
});
vdotInput.addEventListener("input", updateFromVdotInput);
riegelExponentInput.addEventListener("input", updateFromRiegelExponent);
predictionModelInputs.forEach((input) => input.addEventListener("change", () => {
  message.textContent = "";
  updatePredictions();
}));
intervalModelInputs.forEach((input) => input.addEventListener("change", () => {
  message.textContent = "";
  updatePredictions();
}));
updateFromResult();