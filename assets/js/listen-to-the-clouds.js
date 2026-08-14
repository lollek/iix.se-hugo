const somaFmForm = document.querySelector("#somafm-form");
const stationSelector = document.querySelector("#somafm-station");
const liveAtcForm = document.querySelector("#liveatc-form");
const icaoInput = document.querySelector("#liveatc-icao");

somaFmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.open(stationSelector.value, "somafm", "noopener");
});

liveAtcForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const icao = icaoInput.value.trim().toUpperCase();

  if (!/^[A-Z]{3,4}$/.test(icao)) {
    icaoInput.setCustomValidity("Enter a three or four letter ICAO code.");
    icaoInput.reportValidity();
    return;
  }

  icaoInput.setCustomValidity("");
  window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(icao)}`, "liveatc", "noopener");
});
