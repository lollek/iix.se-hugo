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
const nsmResults = document.querySelector("#nsm-results");
const milesInput = document.querySelector("#miles-input");
const kilometresInput = document.querySelector("#kilometres-input");
const distanceConversionSlider = document.querySelector("#distance-conversion-slider");
const solverDistanceInput = document.querySelector("#solver-distance-input");
const solverDistanceSlider = document.querySelector("#solver-distance-slider");
const solverTimeInput = document.querySelector("#solver-time-input");
const solverTimeSlider = document.querySelector("#solver-time-slider");
const solverSpeedInput = document.querySelector("#solver-speed-input");
const solverSpeedSlider = document.querySelector("#solver-speed-slider");
const solverPaceOutput = document.querySelector("#solver-pace-output");
const weeklyMinutesInput = document.querySelector("#weekly-minutes-input");
const weeklyMinutesSlider = document.querySelector("#weekly-minutes-slider");
const subTPercentInput = document.querySelector("#sub-t-percent-input");
const subTPercentSlider = document.querySelector("#sub-t-percent-slider");
const easyPaceInput = document.querySelector("#easy-pace-input");
const longRunEnabled = document.querySelector("#long-run-enabled");
const longRunMultiplierInput = document.querySelector("#long-run-multiplier-input");
const longRunMultiplierSlider = document.querySelector("#long-run-multiplier-slider");
const weeklyPlanSummary = document.querySelector("#weekly-plan-summary");
const weeklyPlanResults = document.querySelector("#weekly-plan-results");

const distances = [
  ["400 m", 500],
  ["1/2 mile", 804.672],
  ["1 km", 1000],
  ["1 mile", 1609.344],
  ["3 km", 3000],
  ["2 mile", 3218.688],
  ["5 km", 5000],
  ["10 km", 10000],
  ["Half marathon", 21097.5],
  ["Marathon", 42195],
];

const nsmWorkouts = [
  { intervalMinutes: 10, baseRepetitions: 3, reference: "150-minute race pace", duration: 150 },
  { intervalMinutes: 6, baseRepetitions: 5, reference: "90-minute race pace", duration: 90 },
  { intervalMinutes: 3, baseRepetitions: 8, reference: "60-minute race pace", duration: 60 },
];

const kilometrePerMile = 1.609344;
const subTWorkoutEasyMinutes = 20;
const subTTargetToleranceMinutes = 3;

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

function formatMinutes(duration) {
  return `${formatDuration(duration)} min`;
}

function formatDistance(distance) {
  return `${distance.toFixed(1)} km`;
}

function paceInMinutes(value) {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());

  return match ? Number(match[1]) + Number(match[2]) / 60 : Number.NaN;
}

function setInputValue(input, value, decimals = 1) {
  input.value = Number(value.toFixed(decimals)).toString();
}

function createCell(row, tagName, value) {
  const cell = document.createElement(tagName);
  cell.textContent = value;
  row.append(cell);
  return cell;
}

function updateDistanceConversion(kilometres) {
  if (!Number.isFinite(kilometres) || kilometres < 0) {
    return;
  }

  setInputValue(kilometresInput, kilometres, 2);
  setInputValue(milesInput, kilometres / kilometrePerMile, 2);
  distanceConversionSlider.value = Math.min(kilometres, Number(distanceConversionSlider.max));
}

function updatePaceSolver(source) {
  const distance = Number(solverDistanceInput.value);
  const time = Number(solverTimeInput.value);
  const speed = Number(solverSpeedInput.value);

  if (!Number.isFinite(distance) || !Number.isFinite(time) || !Number.isFinite(speed) || distance <= 0 || time <= 0 || speed <= 0) {
    return;
  }

  if (source === "speed") {
    const calculatedTime = distance / speed * 60;
    setInputValue(solverTimeInput, calculatedTime);
  } else {
    const calculatedSpeed = distance / time * 60;
    setInputValue(solverSpeedInput, calculatedSpeed);
  }

  solverDistanceSlider.value = Math.min(distance, Number(solverDistanceSlider.max));
  solverTimeSlider.value = Math.min(Number(solverTimeInput.value), Number(solverTimeSlider.max));
  solverSpeedSlider.value = Math.min(Number(solverSpeedInput.value), Number(solverSpeedSlider.max));
  solverPaceOutput.value = `${formatDuration(60 / Number(solverSpeedInput.value))} / km`;
}

function selectSubTWorkouts(targetMinutes) {
  const candidates = nsmWorkouts.map(({ intervalMinutes }) => {
    const targetRepetitions = targetMinutes / 3 / intervalMinutes;
    return Array.from({ length: 5 }, (_, index) => Math.max(1, Math.round(targetRepetitions) + index - 2));
  });
  let bestPlan;

  candidates[0].forEach((tenMinuteRepetitions) => {
    candidates[1].forEach((sixMinuteRepetitions) => {
      candidates[2].forEach((threeMinuteRepetitions) => {
        const repetitions = [tenMinuteRepetitions, sixMinuteRepetitions, threeMinuteRepetitions];
        const durations = repetitions.map((repetitionCount, index) => repetitionCount * nsmWorkouts[index].intervalMinutes);
        const totalMinutes = durations.reduce((sum, duration) => sum + duration, 0);
        const imbalance = Math.max(...durations) - Math.min(...durations);
        const targetDifference = Math.abs(totalMinutes - targetMinutes);
        const score = targetDifference <= subTTargetToleranceMinutes
          ? imbalance + targetDifference / 100
          : 1000 + targetDifference * 100 + imbalance;

        if (!bestPlan || score < bestPlan.score) {
          bestPlan = { repetitions, durations, totalMinutes, score };
        }
      });
    });
  });

  return bestPlan;
}

function appendWeeklyPlanRow(rows, label, structure, easyMinutes, subTMinutes, easyPace, subTPace) {
  const row = document.createElement("tr");
  const estimatedDistance = easyMinutes / easyPace + (subTMinutes ? subTMinutes / subTPace : 0);
  createCell(row, "th", label).scope = "row";
  createCell(row, "td", structure);
  createCell(row, "td", formatMinutes(easyMinutes));
  createCell(row, "td", subTMinutes ? formatMinutes(subTMinutes) : "—");
  createCell(row, "td", formatMinutes(easyMinutes + subTMinutes));
  createCell(row, "td", formatDistance(estimatedDistance));
  rows.push(row);
  return estimatedDistance;
}

function updateWeeklyPlan() {
  const weeklyMinutes = Number(weeklyMinutesInput.value);
  const subTPercent = Number(subTPercentInput.value);
  const multiplier = Number(longRunMultiplierInput.value);
  const easyPace = paceInMinutes(easyPaceInput.value);

  if (!Number.isFinite(weeklyMinutes) || !Number.isFinite(subTPercent) || !Number.isFinite(multiplier) || !Number.isFinite(easyPace) || weeklyMinutes <= 0 || subTPercent <= 0 || multiplier <= 0 || easyPace <= 0) {
    weeklyPlanSummary.textContent = "Enter easy pace as minutes:seconds per kilometre, for example 6:30.";
    weeklyPlanResults.replaceChildren();
    return;
  }

  weeklyMinutesSlider.value = weeklyMinutes;
  subTPercentSlider.value = subTPercent;
  longRunMultiplierSlider.value = multiplier;
  const targetSubTMinutes = weeklyMinutes * subTPercent / 100;
  const subTPlan = selectSubTWorkouts(targetSubTMinutes);
  const plannedSubTPercent = subTPlan.totalMinutes / weeklyMinutes * 100;
  const easyOnlyMinutes = weeklyMinutes - subTPlan.totalMinutes - nsmWorkouts.length * subTWorkoutEasyMinutes;
  const normalEasyMinutes = longRunEnabled.checked
    ? easyOnlyMinutes / (3 + multiplier)
    : easyOnlyMinutes / 4;
  const longRunMinutes = normalEasyMinutes * multiplier;
  const vdot = Number(vdotSlider.value);
  const riegelExponent = Number(riegelExponentInput.value);
  const sourceDistance = Number(distanceInput.value);
  const sourceDuration = Number(hoursInput.value) * 60 + Number(minutesInput.value) + Number(secondsInput.value) / 60;
  const calculationModel = document.querySelector('input[name="calculation-model"]:checked').value;
  const paceForDuration = (duration) => calculationModel === "daniels"
    ? 1000 / speedFor(vdot, duration)
    : riegelPaceFor(sourceDistance, sourceDuration, duration, riegelExponent);
  const rows = [];
  let weeklyDistance = 0;

  weeklyDistance += appendWeeklyPlanRow(rows, "Easy run 1", "Easy", normalEasyMinutes, 0, easyPace, 0);
  nsmWorkouts.forEach((workout, index) => {
    const repetitions = subTPlan.repetitions[index];
    weeklyDistance += appendWeeklyPlanRow(rows, `Sub-T ${index + 1}`, `${repetitions} x ${workout.intervalMinutes} min + 10 min warm-up/cooldown`, subTWorkoutEasyMinutes, subTPlan.durations[index], easyPace, paceForDuration(workout.duration));
  });
  weeklyDistance += appendWeeklyPlanRow(rows, "Easy run 2", "Easy", normalEasyMinutes, 0, easyPace, 0);
  weeklyDistance += appendWeeklyPlanRow(rows, "Easy run 3", "Easy", normalEasyMinutes, 0, easyPace, 0);
  weeklyDistance += appendWeeklyPlanRow(rows, longRunEnabled.checked ? "Long run" : "Easy run 4", longRunEnabled.checked ? `${multiplier.toFixed(1)}x easy run` : "Easy", longRunEnabled.checked ? longRunMinutes : normalEasyMinutes, 0, easyPace, 0);
  weeklyPlanResults.replaceChildren(...rows);
  weeklyPlanSummary.textContent = `Target: ${formatMinutes(targetSubTMinutes)} sub-T (${subTPercent.toFixed(0)}%). Plan: ${formatMinutes(subTPlan.totalMinutes)} sub-T (${plannedSubTPercent.toFixed(1)}%) and ${formatMinutes(weeklyMinutes - subTPlan.totalMinutes)} easy running. Estimated total: ${formatDistance(weeklyDistance)}. Easy-running distance uses ${formatDuration(easyPace)} / km.`;
}

function updatePredictions() {
  const vdot = Number(vdotSlider.value);
  const riegelExponent = Number(riegelExponentInput.value);
  const sourceDistance = Number(distanceInput.value);
  const sourceDuration = Number(hoursInput.value) * 60 + Number(minutesInput.value) + Number(secondsInput.value) / 60;
  const calculationModel = document.querySelector('input[name="calculation-model"]:checked').value;
  vdotInput.value = vdot.toFixed(1);
  riegelExponentControl.hidden = calculationModel !== "riegel";
  predictionExplanations.forEach((explanation) => {
    explanation.hidden = explanation.dataset.predictionExplanation !== calculationModel;
  });

  results.replaceChildren(...distances.map(([label, distance]) => {
    const duration = calculationModel === "daniels"
      ? durationFor(distance, vdot)
      : riegelDurationFor(sourceDistance, sourceDuration, distance, riegelExponent);
    const row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${label}</th><td>${formatDuration(duration / (distance / 1000))}</td><td>${formatDuration(duration)}</td>`;
    return row;
  }));

  nsmResults.replaceChildren(...nsmWorkouts.map(({ intervalMinutes, baseRepetitions, reference, duration }) => {
    const pace = calculationModel === "daniels"
      ? 1000 / speedFor(vdot, duration)
      : riegelPaceFor(sourceDistance, sourceDuration, duration, riegelExponent);
    const row = document.createElement("tr");
    createCell(row, "th", `${baseRepetitions} x ${intervalMinutes} min`).scope = "row";
    createCell(row, "td", reference);
    createCell(row, "td", formatDuration(pace));
    return row;
  }));

  updateWeeklyPlan();
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
calculationModelInputs.forEach((input) => input.addEventListener("change", () => {
  message.textContent = "";
  updatePredictions();
}));
kilometresInput.addEventListener("input", () => updateDistanceConversion(Number(kilometresInput.value)));
milesInput.addEventListener("input", () => updateDistanceConversion(Number(milesInput.value) * kilometrePerMile));
distanceConversionSlider.addEventListener("input", () => updateDistanceConversion(Number(distanceConversionSlider.value)));
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
[
  [weeklyMinutesInput, weeklyMinutesSlider],
  [weeklyMinutesSlider, weeklyMinutesInput],
  [subTPercentInput, subTPercentSlider],
  [subTPercentSlider, subTPercentInput],
  [longRunMultiplierInput, longRunMultiplierSlider],
  [longRunMultiplierSlider, longRunMultiplierInput],
].forEach(([input, pairedInput]) => input.addEventListener("input", () => {
  pairedInput.value = input.value;
  updateWeeklyPlan();
}));
easyPaceInput.addEventListener("input", updateWeeklyPlan);
longRunEnabled.addEventListener("change", updateWeeklyPlan);
updateDistanceConversion(Number(kilometresInput.value));
updatePaceSolver("speed");
updateWeeklyPlan();
updateFromResult();