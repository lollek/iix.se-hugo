import { durationFor, formatDuration, riegelDurationFor, vdotFor } from "./model.js";

const distanceInput = document.querySelector("#race-distance");
const hoursInput = document.querySelector("#race-hours");
const minutesInput = document.querySelector("#race-minutes");
const secondsInput = document.querySelector("#race-seconds");
const vdotSlider = document.querySelector("#vdot-slider");
const vdotInput = document.querySelector("#vdot-input");
const calculationModelInputs = document.querySelectorAll('input[name="calculation-model"]');
const predictionExplanations = document.querySelectorAll("[data-prediction-explanation]");
const riegelExponentControl = document.querySelector("#riegel-exponent-control");
const riegelExponentInput = document.querySelector("#riegel-exponent");
const message = document.querySelector("#input-message");
const results = document.querySelector("#prediction-results");

const distances = [["400 m", 400], ["1/2 mile", 804.672], ["1 km", 1000], ["1 mile", 1609.344], ["3 km", 3000], ["2 mile", 3218.688], ["5 km", 5000], ["10 km", 10000], ["Half marathon", 21097.5], ["Marathon", 42195]];

function sourceDuration() {
  return Number(hoursInput.value) * 60 + Number(minutesInput.value) + Number(secondsInput.value) / 60;
}

function updatePredictions() {
  const vdot = Number(vdotSlider.value);
  const exponent = Number(riegelExponentInput.value);
  const model = document.querySelector('input[name="calculation-model"]:checked').value;
  vdotInput.value = vdot.toFixed(1);
  riegelExponentControl.hidden = model !== "riegel";
  predictionExplanations.forEach((explanation) => { explanation.hidden = explanation.dataset.predictionExplanation !== model; });
  results.replaceChildren(...distances.map(([label, distance]) => {
    const duration = model === "daniels" ? durationFor(distance, vdot) : riegelDurationFor(Number(distanceInput.value), sourceDuration(), distance, exponent);
    const row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${label}</th><td>${formatDuration(duration / (distance / 1000))}</td><td>${formatDuration(duration)}</td>`;
    return row;
  }));
}

function updateFromResult() {
  const hours = Number(hoursInput.value);
  const minutes = Number(minutesInput.value);
  const seconds = Number(secondsInput.value);
  const duration = sourceDuration();
  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds) || hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59 || duration <= 0) {
    message.textContent = "Enter a valid race time with minutes and seconds from 0 to 59.";
    return;
  }
  const vdot = vdotFor(Number(distanceInput.value), duration);
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

[distanceInput, hoursInput, minutesInput, secondsInput].forEach((input) => input.addEventListener("input", updateFromResult));
vdotSlider.addEventListener("input", () => { message.textContent = ""; updatePredictions(); });
vdotInput.addEventListener("input", updateFromVdotInput);
riegelExponentInput.addEventListener("input", updatePredictions);
calculationModelInputs.forEach((input) => input.addEventListener("change", updatePredictions));
updateFromResult();
