const musicSource = document.querySelector("#music-source");
const musicProviders = document.querySelectorAll("[data-music-provider]");
const somaFmForm = document.querySelector("#somafm-form");
const stationSelector = document.querySelector("#somafm-station");
const liveAtcForm = document.querySelector("#liveatc-form");
const icaoInput = document.querySelector("#liveatc-icao");

function selectMusicSource(source) {
  musicProviders.forEach((provider) => {
    const isSelected = provider.dataset.musicProvider === source;
    const embed = provider.querySelector("iframe[data-src]");
    provider.hidden = !isSelected;

    if (embed) {
      if (isSelected && !embed.src) {
        embed.src = embed.dataset.src;
      } else if (!isSelected) {
        embed.removeAttribute("src");
      }
    }
  });
}

selectMusicSource(musicSource.value);
musicSource.addEventListener("change", () => selectMusicSource(musicSource.value));

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
