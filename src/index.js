import "./style.css";

const searchInput = document.querySelector("#weather-search");
const form = document.querySelector(".search-form");
const searchButton = form.querySelector("button");
const statusMessage = document.querySelector("#status-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (city) {
    fetchWeather(city);
  }
});

function formatTemperature(temperature) {
  return `${Math.round(temperature)}°`;
}

function formatLocalDate(timestamp, timezoneOffset) {
  const localTime = new Date((timestamp + timezoneOffset) * 1000);

  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(localTime);
}

function formatLocalTime(timestamp, timezoneOffset) {
  const localTime = new Date((timestamp + timezoneOffset) * 1000);

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(localTime);
}

function describeWind(speed) {
  if (speed < 1) return "Calm conditions";
  if (speed < 12) return "A gentle breeze";
  if (speed < 30) return "A steady breeze";
  return "A blustery day";
}

function renderWeather(data) {
  const weather = data.weather[0];
  const description = weather.description.replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );

  document.querySelector("#city-name").textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector("#local-date").textContent = formatLocalDate(
    data.dt,
    data.timezone,
  );
  document.querySelector("#temperature").innerHTML =
    `${Math.round(data.main.temp)}<span>°</span>`;
  document.querySelector("#condition").textContent = description;
  document.querySelector("#feels-like").textContent = formatTemperature(
    data.main.feels_like,
  );
  document.querySelector("#high-temp").textContent = formatTemperature(
    data.main.temp_max,
  );
  document.querySelector("#low-temp").textContent = formatTemperature(
    data.main.temp_min,
  );
  document.querySelector("#metric-feels-like").innerHTML =
    `${Math.round(data.main.feels_like)}<span>°</span>`;
  document.querySelector("#humidity").innerHTML =
    `${data.main.humidity}<span>%</span>`;
  document.querySelector("#wind-speed").innerHTML =
    `${Math.round(data.wind.speed * 3.6)}<span> km/h</span>`;
  document.querySelector("#wind-direction").textContent = describeWind(
    data.wind.speed,
  );
  document.querySelector("#visibility").innerHTML =
    `${(data.visibility / 1000).toFixed(1)}<span> km</span>`;
  document.querySelector("#sunrise").textContent = formatLocalTime(
    data.sys.sunrise,
    data.timezone,
  );
  document.querySelector("#sunset").textContent = formatLocalTime(
    data.sys.sunset,
    data.timezone,
  );

  const icon = document.querySelector("#weather-icon");
  icon.src = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
  icon.alt = description;
}

async function fetchWeather(city) {
  const apiKey = "348db0259f011c2e053737f909642d5f";
  const params = new URLSearchParams({
    q: city,
    units: "metric",
    appid: apiKey,
  });

  statusMessage.textContent = `Checking the weather in ${city}…`;
  searchButton.disabled = true;
  searchButton.textContent = "Searching";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${params}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`We couldn’t find “${city}”. Try another city.`);
      }
      if (response.status === 401) {
        throw new Error("Weather service is unavailable right now.");
      }
      throw new Error("Couldn’t load the weather. Please try again.");
    }

    const data = await response.json();
    renderWeather(data);
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent =
      error instanceof TypeError
        ? "Couldn’t connect to the weather service. Check your connection and try again."
        : error.message;
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
}

searchInput.value = "London";
fetchWeather("London");
