// const allMinicards = document.querySelectorAll(".minicard");

// allMinicards.forEach((minicard) => {
//   minicard.addEventListener("click", () => {
//     allMinicards.forEach((card) => card.classList.remove("active"));

//     minicard.classList.add("active");
//   });
// });
import config from "./config.js";

// GETDATE
function formatCurrentDate() {
  const date = document.querySelector(`.date`);
  const day = document.querySelector(".day");
  const today = new Date().toLocaleDateString("en-us", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  date.innerText = today;
  day.innerText = "Today";
}
// Example usage
formatCurrentDate();

// API KEY
const APIKey = config.apikey;

// FUNCTION FOR GET CURRENT LOCATION
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        showError,
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

// Example of using the getLocation function
getLocation()
  .then((location) => {
    // Use the location.latitude and location.longitude here
    console.log("Latitude: ", location.latitude);
    console.log("Longitude: ", location.longitude);

    // Call another function with the location values
    getCurrentLoc(location.latitude, location.longitude);
    getCurrentForecast(location.latitude, location.longitude);
  })
  .catch((error) => {
    console.error(error);
  });

// Fungsi untuk menangani kesalahan jika gagal mendapatkan lokasi
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Akses Lokasi Ditolak oleh Pengguna.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Informasi Lokasi Tidak Tersedia.");
      break;
    case error.TIMEOUT:
      alert("Waktu Permintaan Lokasi Habis.");
      break;
    case error.UNKNOWN_ERROR:
      alert("Terjadi Kesalahan yang Tidak Diketahui.");
      break;
  }
}

const getCurrentLoc = (latitude, longitude) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${APIKey}&units=metric`
  )
    .then((response) => response.json())
    .then((json) => {
      const temperature = document.querySelector(".temperature");
      const image = document.querySelector(".iconStatus");
      const loc = document.querySelector(`.loc`);
      const gif = document.querySelector(`.gif`);
      const statusWeather = document.querySelector(".status");
      const humidity = document.querySelector(`.humidity .value`);
      const windspeed = document.querySelector(`.windSpeed .value`);
      let descForecast = "";

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "./img/Partly Cloudy Day.png";
          image.style.width = "55px";
          descForecast = "Clear";
          break;
        case "Clouds":
          image.src = "./img/Cloud.png";
          image.style.width = "55px";
          descForecast = "Cloudy";
          break;
        case "Rain":
          image.src = "./img/Rain.png";
          image.style.width = "55px";
          descForecast = "Rain";
          break;
        case "Snow":
          image.src = "./img/Snow.png";
          image.style.width = "55px";
          descForecast = "Snow";
          break;
        case "Haze":
          image.src = "./img/Storm.png";
          image.style.width = "55px";
          descForecast = "Storm";
          break;

        default:
          image.src = "";
      }

      temperature.innerHTML = `${Math.ceil(json.main.temp)}<span>°C</span>`;
      statusWeather.innerHTML = `${descForecast}`;
      loc.innerHTML = `${json.name}, ${json.sys.country}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      windspeed.innerHTML = `${json.wind.speed}Km/h`;
    });
};

const getCurrentForecast = (latitude, longitude) => {
  const weatherMinicard = document.querySelector(".forecast");

  let iconForecast = "";
  let descForecast = "";
  // function to create minicard for each day of the forecast
  const createMinicard = (item, index) => {
    // for decide the src of img(icon) based on case description weather
    switch (item.weather[0].main) {
      case "Clear":
        iconForecast = "./img/Partly Cloudy Day.png";
        descForecast = "Clear";
        break;
      case "Clouds":
        iconForecast = "./img/Cloud.png";
        descForecast = "Cloudy";
        break;
      case "Rain":
        iconForecast = "./img/Rain.png";
        descForecast = "Rain";
        break;
      case "Snow":
        iconForecast = "./img/Snow.png";
        descForecast = "Snow";
        break;
      case "Haze":
        iconForecast = "./img/Storm.png";
        descForecast = "Storm";
        break;

      default:
        image.src = "";
    }

    if (index !== 0) {
      const dateValue =
        index === 1
          ? "Tommorow"
          : new Date(item.dt_txt).toLocaleDateString("en-us", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

      return `<div class="minicard active">
      <h4 class="stats">${descForecast}</h4>
      <h4 class="date">${dateValue}</h4>
      </h4>
      <img
        src="${iconForecast}"
        alt="status weather"
        width="75px"
        class="iconForecast"
      />
      <h4 class="temperature">${item.main.temp} °C</h4>
    </div>`;
    }
  };

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${APIKey}&units=metric`
  )
    .then((response) => response.json())
    .then((json) => {
      const uniqueForecastDays = [];
      // for filter the forecasts to get only one forecast per day
      const weatherForecast = json.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      console.log(weatherForecast);

      weatherMinicard.innerHTML = "";

      weatherForecast.forEach((item, index) => {
        const html = createMinicard(item, index);
        if (index !== 0 && index !== 5) {
          weatherMinicard.insertAdjacentHTML("beforeend", html);
        }
      });
    });
};

// FOR GET WEATHER INFO
const inputcity = document.querySelector(".search-input input");

inputcity.addEventListener("keypress", (event) => {
  // GET CITY NAME
  const city = document.querySelector(".search-input input").value;
  if (event.key === "Enter") {
    getWeather(city);
    getForecast(city);
  }
});

const getWeather = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}&units=metric`
    );

    if (response.ok) {
      const jsonResponse = await response.json();

      console.log(jsonResponse);

      const temperature = document.querySelector(".temperature");
      const image = document.querySelector(".iconStatus");
      const loc = document.querySelector(`.loc`);
      const gif = document.querySelector(`.gif`);
      const statusWeather = document.querySelector(".status");
      const humidity = document.querySelector(`.humidity .value`);
      const windspeed = document.querySelector(`.windSpeed .value`);
      let descForecast = "";

      switch (jsonResponse.weather[0].main) {
        case "Clear":
          image.src = "./img/Partly Cloudy Day.png";
          image.style.width = "55px";
          descForecast = "Clear";
          break;
        case "Clouds":
          image.src = "./img/Cloud.png";
          image.style.width = "55px";
          descForecast = "Cloudy";
          break;
        case "Rain":
          image.src = "./img/Rain.png";
          image.style.width = "55px";
          descForecast = "Rain";
          break;
        case "Snow":
          image.src = "./img/Snow.png";
          image.style.width = "55px";
          descForecast = "Snow";
          break;
        case "Haze":
          image.src = "./img/Storm.png";
          image.style.width = "55px";
          descForecast = "Storm";
          break;

        default:
          image.src = "";
      }

      temperature.innerHTML = `${parseInt(
        jsonResponse.main.temp
      )}<span>°C</span>`;
      statusWeather.innerHTML = `${descForecast}`;
      loc.innerHTML = `${jsonResponse.name}, ${jsonResponse.sys.country}`;
      humidity.innerHTML = `${jsonResponse.main.humidity}%`;
      windspeed.innerHTML = `${jsonResponse.wind.speed}Km/h`;
    }
  } catch (err) {
    console.log(err);
  }
};

const getForecast = async (city) => {
  const weatherMinicard = document.querySelector(".forecast");

  let iconForecast = "";
  let descForecast = "";

  // function to create minicard for each day of the forecast
  const createMinicard = (item, index) => {
    // for decide the src of img(icon) based on case description weather
    switch (item.weather[0].main) {
      case "Clear":
        iconForecast = "./img/Partly Cloudy Day.png";
        descForecast = "Clear";
        break;
      case "Clouds":
        iconForecast = "./img/Cloud.png";
        descForecast = "Cloudy";
        break;
      case "Rain":
        iconForecast = "./img/Rain.png";
        descForecast = "Rain";
        break;
      case "Snow":
        iconForecast = "./img/Snow.png";
        descForecast = "Snow";
        break;
      case "Haze":
        iconForecast = "./img/Storm.png";
        descForecast = "Storm";
        break;

      default:
        image.src = "";
    }

    if (index !== 0) {
      return `  <div class="minicard active">
      <h4 class="stats">${descForecast}</h4>
      <h4 class="date">${new Date(item.dt_txt).toLocaleDateString("en-us", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })}</h4>
      <img
        src="${iconForecast}"
        alt="status weather"
        width="75px"
        class="iconForecast"
      />
      <h4 class="temperature">${item.main.temp} °C </h4>
    </div>`;
    }
  };

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APIKey}&units=metric`
    );
    if (response.ok) {
      const jsonResponse = await response.json();

      const uniqueForecastDays = [];
      // for filter the forecasts to get only one forecast per day
      const weatherForecast = jsonResponse.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      console.log(weatherForecast);

      weatherMinicard.innerHTML = "";

      weatherForecast.forEach((item, index) => {
        const html = createMinicard(item, index);
        if (index !== 0 && index !== 5) {
          weatherMinicard.insertAdjacentHTML("beforeend", html);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};
