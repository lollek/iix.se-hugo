export function oxygenCost(speed) {
  return -4.6 + 0.182258 * speed + 0.000104 * speed ** 2;
}

export function percentMaxOxygen(duration) {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * duration) + 0.2989558 * Math.exp(-0.1932605 * duration);
}

export function vdotFor(distance, duration) {
  return oxygenCost(distance / duration) / percentMaxOxygen(duration);
}

export function speedFor(vdot, duration) {
  const oxygen = vdot * percentMaxOxygen(duration);
  return (-0.182258 + Math.sqrt(0.182258 ** 2 - 4 * 0.000104 * (-4.6 - oxygen))) / (2 * 0.000104);
}

export function durationFor(distance, vdot) {
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

export function riegelDurationFor(sourceDistance, sourceDuration, targetDistance, exponent) {
  return sourceDuration * (targetDistance / sourceDistance) ** exponent;
}

export function riegelPaceFor(sourceDistance, sourceDuration, targetDuration, exponent) {
  const targetDistance = sourceDistance * (targetDuration / sourceDuration) ** (1 / exponent);
  return targetDuration / (targetDistance / 1000);
}

export function formatDuration(duration) {
  const totalSeconds = Math.round(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
