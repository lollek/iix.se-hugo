const kilometrePerMile = 1.609344;
const milesInput = document.querySelector("#miles-input");
const kilometresInput = document.querySelector("#kilometres-input");
const distanceConversionSlider = document.querySelector("#distance-conversion-slider");
const paceKilometresInput = document.querySelector("#pace-kilometres-input");
const paceMilesInput = document.querySelector("#pace-miles-input");
const paceConversionMessage = document.querySelector("#pace-conversion-message");
const solverDistanceInput = document.querySelector("#solver-distance-input");
const solverDistanceSlider = document.querySelector("#solver-distance-slider");
const solverTimeInput = document.querySelector("#solver-time-input");
const solverTimeSlider = document.querySelector("#solver-time-slider");
const solverSpeedInput = document.querySelector("#solver-speed-input");
const solverSpeedSlider = document.querySelector("#solver-speed-slider");
const solverPaceOutput = document.querySelector("#solver-pace-output");

function formatPace(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

function paceInMinutes(value) {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  return match ? Number(match[1]) + Number(match[2]) / 60 : Number.NaN;
}

function setInputValue(input, value, decimals = 1) {
  input.value = Number(value.toFixed(decimals)).toString();
}

function updateDistanceConversion(kilometres) {
  if (!Number.isFinite(kilometres) || kilometres < 0) {
    return;
  }

  setInputValue(kilometresInput, kilometres, 2);
  setInputValue(milesInput, kilometres / kilometrePerMile, 2);
  distanceConversionSlider.value = Math.min(kilometres, Number(distanceConversionSlider.max));
}

function updatePaceConversion(source) {
  const pace = paceInMinutes(source.value);
  if (!Number.isFinite(pace) || pace <= 0) {
    paceConversionMessage.textContent = "Enter pace as minutes:seconds, for example 5:00.";
    return;
  }

  paceConversionMessage.textContent = "";
  if (source === paceKilometresInput) {
    paceMilesInput.value = formatPace(pace * kilometrePerMile);
  } else {
    paceKilometresInput.value = formatPace(pace / kilometrePerMile);
  }
}

function updatePaceSolver(source) {
  const distance = Number(solverDistanceInput.value);
  const time = Number(solverTimeInput.value);
  const speed = Number(solverSpeedInput.value);
  if (!Number.isFinite(distance) || !Number.isFinite(time) || !Number.isFinite(speed) || distance <= 0 || time <= 0 || speed <= 0) {
    return;
  }

  if (source === "speed") {
    setInputValue(solverTimeInput, distance / speed * 60);
  } else {
    setInputValue(solverSpeedInput, distance / time * 60);
  }

  solverDistanceSlider.value = Math.min(distance, Number(solverDistanceSlider.max));
  solverTimeSlider.value = Math.min(Number(solverTimeInput.value), Number(solverTimeSlider.max));
  solverSpeedSlider.value = Math.min(Number(solverSpeedInput.value), Number(solverSpeedSlider.max));
  solverPaceOutput.value = `${formatPace(60 / Number(solverSpeedInput.value))} / km`;
}

kilometresInput.addEventListener("input", () => updateDistanceConversion(Number(kilometresInput.value)));
milesInput.addEventListener("input", () => updateDistanceConversion(Number(milesInput.value) * kilometrePerMile));
distanceConversionSlider.addEventListener("input", () => updateDistanceConversion(Number(distanceConversionSlider.value)));
paceKilometresInput.addEventListener("input", () => updatePaceConversion(paceKilometresInput));
paceMilesInput.addEventListener("input", () => updatePaceConversion(paceMilesInput));
[
  [solverDistanceInput, "distance"],
  [solverDistanceSlider, "distance"],
  [solverTimeInput, "time"],
  [solverTimeSlider, "time"],
  [solverSpeedInput, "speed"],
  [solverSpeedSlider, "speed"],
].forEach(([input, source]) => input.addEventListener("input", () => {
  if (source === "distance") {
    solverDistanceInput.value = input.value;
  } else if (source === "time") {
    solverTimeInput.value = input.value;
  } else {
    solverSpeedInput.value = input.value;
  }
  updatePaceSolver(source);
}));

updateDistanceConversion(Number(kilometresInput.value));
updatePaceConversion(paceKilometresInput);
updatePaceSolver("speed");
