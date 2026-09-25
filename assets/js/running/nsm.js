import { formatDuration, riegelPaceFor, speedFor, vdotFor } from "./model.js";

const byId = (id) => document.querySelector(`#${id}`);
const distanceInput = byId("race-distance"); const hoursInput = byId("race-hours"); const minutesInput = byId("race-minutes"); const secondsInput = byId("race-seconds"); const vdotSlider = byId("vdot-slider"); const vdotInput = byId("vdot-input"); const riegelExponentControl = byId("riegel-exponent-control"); const riegelExponentInput = byId("riegel-exponent"); const message = byId("input-message"); const nsmResults = byId("nsm-results"); const weeklyMinutesInput = byId("weekly-minutes-input"); const weeklyMinutesSlider = byId("weekly-minutes-slider"); const subTPercentInput = byId("sub-t-percent-input"); const subTPercentSlider = byId("sub-t-percent-slider"); const easyPaceInput = byId("easy-pace-input"); const longRunEnabled = byId("long-run-enabled"); const longRunMultiplierInput = byId("long-run-multiplier-input"); const longRunMultiplierSlider = byId("long-run-multiplier-slider"); const weeklyPlanSummary = byId("weekly-plan-summary"); const weeklyPlanResults = byId("weekly-plan-results");
const modelInputs = document.querySelectorAll('input[name="calculation-model"]');
const workouts = [{ intervalMinutes: 10, baseRepetitions: 3, reference: "150-minute race pace", duration: 150 }, { intervalMinutes: 6, baseRepetitions: 5, reference: "90-minute race pace", duration: 90 }, { intervalMinutes: 3, baseRepetitions: 8, reference: "60-minute race pace", duration: 60 }];
const workoutEasyMinutes = 20; const targetToleranceMinutes = 3;

function duration() { return Number(hoursInput.value) * 60 + Number(minutesInput.value) + Number(secondsInput.value) / 60; }
function model() { return document.querySelector('input[name="calculation-model"]:checked').value; }
function minutesForPace(value) { const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim()); return match ? Number(match[1]) + Number(match[2]) / 60 : Number.NaN; }
function cell(row, tag, value) { const element = document.createElement(tag); element.textContent = value; row.append(element); return element; }
function minutes(value) { return `${formatDuration(value)} min`; }
function kilometres(value) { return `${value.toFixed(1)} km`; }
function paceFor(durationMinutes) { return model() === "daniels" ? 1000 / speedFor(Number(vdotSlider.value), durationMinutes) : riegelPaceFor(Number(distanceInput.value), duration(), durationMinutes, Number(riegelExponentInput.value)); }

function selectWorkouts(target) {
  const candidates = workouts.map(({ intervalMinutes }) => Array.from({ length: 5 }, (_, index) => Math.max(1, Math.round(target / 3 / intervalMinutes) + index - 2)));
  let best;
  candidates[0].forEach((ten) => candidates[1].forEach((six) => candidates[2].forEach((three) => {
    const repetitions = [ten, six, three]; const durations = repetitions.map((count, index) => count * workouts[index].intervalMinutes); const totalMinutes = durations.reduce((sum, value) => sum + value, 0); const difference = Math.abs(totalMinutes - target); const imbalance = Math.max(...durations) - Math.min(...durations); const score = difference <= targetToleranceMinutes ? imbalance + difference / 100 : 1000 + difference * 100 + imbalance;
    if (!best || score < best.score) best = { repetitions, durations, totalMinutes, score };
  })));
  return best;
}

function updateWeeklyPlan() {
  const weeklyMinutes = Number(weeklyMinutesInput.value); const targetPercent = Number(subTPercentInput.value); const multiplier = Number(longRunMultiplierInput.value); const easyPace = minutesForPace(easyPaceInput.value);
  if (![weeklyMinutes, targetPercent, multiplier, easyPace].every(Number.isFinite) || weeklyMinutes <= 0 || targetPercent <= 0 || multiplier <= 0 || easyPace <= 0) { weeklyPlanSummary.textContent = "Enter easy pace as minutes:seconds per kilometre, for example 6:30."; weeklyPlanResults.replaceChildren(); return; }
  weeklyMinutesSlider.value = weeklyMinutes; subTPercentSlider.value = targetPercent; longRunMultiplierSlider.value = multiplier;
  const plan = selectWorkouts(weeklyMinutes * targetPercent / 100); const easyOnly = weeklyMinutes - plan.totalMinutes - workouts.length * workoutEasyMinutes; const normalEasy = longRunEnabled.checked ? easyOnly / (3 + multiplier) : easyOnly / 4; const longRun = normalEasy * multiplier; const rows = []; let weeklyDistance = 0;
  const append = (label, structure, easy, subT, subTPace = 0) => { const row = document.createElement("tr"); const distance = easy / easyPace + (subT ? subT / subTPace : 0); cell(row, "th", label).scope = "row"; cell(row, "td", structure); cell(row, "td", minutes(easy)); cell(row, "td", subT ? minutes(subT) : "—"); cell(row, "td", minutes(easy + subT)); cell(row, "td", kilometres(distance)); rows.push(row); weeklyDistance += distance; };
  append("Easy run 1", "Easy", normalEasy, 0); workouts.forEach((workout, index) => { append(`Sub-T ${index + 1}`, `${plan.repetitions[index]} x ${workout.intervalMinutes} min + 10 min warm-up/cooldown`, workoutEasyMinutes, plan.durations[index], paceFor(workout.duration)); if (index < 2) append(`Easy run ${index + 2}`, "Easy", normalEasy, 0); }); append(longRunEnabled.checked ? "Long run" : "Easy run 4", longRunEnabled.checked ? `${multiplier.toFixed(1)}x easy run` : "Easy", longRunEnabled.checked ? longRun : normalEasy, 0);
  weeklyPlanResults.replaceChildren(...rows); weeklyPlanSummary.textContent = `Target: ${minutes(weeklyMinutes * targetPercent / 100)} sub-T (${targetPercent.toFixed(0)}%). Plan: ${minutes(plan.totalMinutes)} sub-T (${(plan.totalMinutes / weeklyMinutes * 100).toFixed(1)}%) and ${minutes(weeklyMinutes - plan.totalMinutes)} easy running. Estimated total: ${kilometres(weeklyDistance)}. Easy-running distance uses ${formatDuration(easyPace)} / km.`;
}

function update() {
  const currentModel = model(); const vdot = Number(vdotSlider.value); vdotInput.value = vdot.toFixed(1); riegelExponentControl.hidden = currentModel !== "riegel";
  nsmResults.replaceChildren(...workouts.map((workout) => { const row = document.createElement("tr"); cell(row, "th", `${workout.baseRepetitions} x ${workout.intervalMinutes} min`).scope = "row"; cell(row, "td", workout.reference); cell(row, "td", formatDuration(paceFor(workout.duration))); return row; })); updateWeeklyPlan();
}
function updateFromResult() { const value = duration(); const vdot = vdotFor(Number(distanceInput.value), value); if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(vdot) || vdot < 20 || vdot > 85) { message.textContent = "Enter a valid race result within this calculator's VDOT range."; return; } message.textContent = ""; vdotSlider.value = vdot.toFixed(1); update(); }
function updateFromVdot() { const vdot = Number(vdotInput.value); if (!Number.isFinite(vdot) || vdot < 20 || vdot > 85) { message.textContent = "Enter a VDOT from 20.0 to 85.0."; return; } message.textContent = ""; vdotSlider.value = vdot.toFixed(1); update(); }
[distanceInput, hoursInput, minutesInput, secondsInput].forEach((input) => input.addEventListener("input", updateFromResult)); vdotSlider.addEventListener("input", update); vdotInput.addEventListener("input", updateFromVdot); riegelExponentInput.addEventListener("input", update); modelInputs.forEach((input) => input.addEventListener("change", update)); [[weeklyMinutesInput, weeklyMinutesSlider], [weeklyMinutesSlider, weeklyMinutesInput], [subTPercentInput, subTPercentSlider], [subTPercentSlider, subTPercentInput], [longRunMultiplierInput, longRunMultiplierSlider], [longRunMultiplierSlider, longRunMultiplierInput]].forEach(([input, paired]) => input.addEventListener("input", () => { paired.value = input.value; updateWeeklyPlan(); })); easyPaceInput.addEventListener("input", updateWeeklyPlan); longRunEnabled.addEventListener("change", updateWeeklyPlan); updateFromResult();
