const headerElement = document.createElement('header');
headerElement.classList.add('header');
headerElement.innerHTML = `<section class="refresh-section header__section">
<button class="header__button refresh-button">&#x21bb;</button>
</section>
<section class="language-options header__section">
<button class="header__button english-language-button pressed">EN</button>
<button class="header__button russian-language-button">RU</button>
<button class="header__button belorussian-language-button">BY</button>
</section>
<section class="temperature-conversion-options header__section">
<button class="header__button button-celsius pressed">&deg;C</button>
<button class="header__button button-fahrenheit">&deg;F</button>
</section>
<section class="location-search header__section">
<div class="location-search__input-wrapper">
  <button class="header__button voice-search-button">
    <img src="./assets/images/Microphone.png" alt="Microphone" height="12px">
  </button>
  <input class="location-search__input" type="text" placeholder="Enter Location">
  <div class="location-options"></div>
</div>
<button class="header__button search-button">Search</button>
</section>`;

const mainElement = document.createElement('main');
mainElement.classList.add('main');
mainElement.classList.add('hidden');
mainElement.innerHTML = `<section class="weather-data">
<div class="weather-data__item weather-data__location">
  <p class="location"></p>
  <p class="current-date"></p>
  <p><span class="local-time"></span><span class="current-time"></span></p>
</div>
  <div class="current-temperature-and-image">
    <img class="weather-image hidden" src="" alt="today's weather image">
    <p class="weather-data__item current-temperature"></p>
  </div>
  <div class="weather-data__item current-weather">
    <p class="current-weather__cloudiness"></p>
    <p class="current-weather__pressure"></p>
    <p class="current-weather__wind"></p>
    <p class="current-weather__humidity"></p>
  </div>
  <div class="weather-data__item weather-data__tomorrow">
    <p class="next-day"></p>
    <img class="weather-small-image next-day-weather-image hidden" src="" alt="tomorrow's weather image">
    <p class="temperature-next-day"></p>
  </div>
  <div class="weather-data__item">
    <p class="next-second-day"></p>
    <img class="weather-small-image next-second-day-weather-image hidden" src="" alt="tomorrow's weather image">
    <p class="temperature-next-second-day"></p>
  </div>
  <div class="weather-data__item">
    <p class="next-third-day"></p>
    <img class="weather-small-image next-third-day-weather-image hidden" src="" alt="tomorrow's weather image">
    <p class="temperature-next-third-day"></p>
  </div>
</section>
<section class="location-data">
<div class="location-data__coordinates">
  <p class="location-data__latitude"></p>
  <p class="location-data__longitude"></p>
</div>
<div id="map"></div>
</section>`;

const bodyElement = document.querySelector('body');
bodyElement.appendChild(headerElement);
bodyElement.appendChild(mainElement);

let userSettings = {
  language: 'en',
  temperature: 'Celsius',
  coordinates: {
    locationName: undefined,
    latitude: undefined,
    longitude: undefined,
  },
  voiceSearchLanguage: 'en-US',
};

// Does NOT work with const/let:
// Uncaught ReferenceError: Cannot access 'SpeechRecognition' before initialization
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const voiceSearchButton = document.querySelector('.voice-search-button');
voiceSearchButton.addEventListener('click', () => {
  recognition.start();
});

const input = document.querySelector('.location-search__input');
const searchButton = document.querySelector('.search-button');
const locationOptions = document.querySelector('.location-options');

function getGeoLocation() {
  const inputValue = input.value;

  if (inputValue.length === 0) {
    return;
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?key=874c181d9cc34c25973b973a971e7893&q=${inputValue}&language=${userSettings.language}&pretty=1&no_annotations=1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const optionsCount = data.results.length;

      if (optionsCount === 0) {
        const option = document.createElement('p');
        option.classList.add('location-options__header');
        if (userSettings.language === 'en') {
          option.innerHTML = 'Nothing found';
        } else if (userSettings.language === 'ru') {
          option.innerHTML = 'Ничего не найдено';
        } else if (userSettings.language === 'be') {
          option.innerHTML = 'Нічога не знойдзена';
        }
        locationOptions.appendChild(option);
      } else {
        const option = document.createElement('p');
        option.classList.add('location-options__header');
        if (userSettings.language === 'en') {
          option.innerHTML = 'Please, choose the correct option:';
        } else if (userSettings.language === 'ru') {
          option.innerHTML = 'Пожалуйста, выберите корректный вариант:';
        } else if (userSettings.language === 'be') {
          option.innerHTML = 'Калі ласка, абярыце карэктны варыянт:';
        }
        locationOptions.appendChild(option);

        for (let i = 0; i < optionsCount; i += 1) {
          if (optionsCount > 0) {
            const singleOption = document.createElement('p');
            singleOption.coordinates = {
              locationName: data.results[i].formatted,
              latitude: data.results[i].geometry.lat,
              longitude: data.results[i].geometry.lng,
            };
            singleOption.classList.add('location-options__single-option');
            singleOption.innerHTML = `${singleOption.coordinates.locationName}`;
            locationOptions.appendChild(singleOption);
          }
        }

        const note = document.createElement('p');
        note.classList.add('location-options__note');
        if (userSettings.language === 'en') {
          note.innerHTML = 'NOTE: Sometimes different locations may have the SAME NAME! So if you see SAME NAMES, then check their location the MAP.';
        } else if (userSettings.language === 'ru') {
          note.innerHTML = 'ВНИМАНИЕ: Иногда у разных населённых пунктов бывают ОДИНАКОВЫЕ НАЗВАНИЯ! Если вы видите ОДИНАКОВЫЕ НАЗВАНИЯ, то проверьте их по КАРТЕ.';
        } else if (userSettings.language === 'be') {
          note.innerHTML = 'УВАГА: Часам у розных населеных пунктаў бываюць АДНОЛЬКАВЫЕ НАЗВЫ! Калі вы бачыце АДНОЛЬКАВЫЕ НАЗВЫ, то праверце іх па КАРТЕ.';
        }
        locationOptions.appendChild(note);
      }

      locationOptions.style.bottom = `-${locationOptions.scrollHeight}px`;
      locationOptions.style.maxHeight = `${locationOptions.scrollHeight}px`;
    });
}

searchButton.addEventListener('click', getGeoLocation);

recognition.onresult = (event) => {
  input.value = event.results[0][0].transcript;
  getGeoLocation();
};

function checkTime(i) {
  let digit = i;
  if (i < 10) {
    digit = `0${i}`;
  }
  return digit;
}

function startTime(today) {
  const h = today.getHours();
  let m = today.getMinutes();
  m = checkTime(m);
  document.querySelector('.current-time').innerHTML = `${h}:${m}`;
}

function getCurrentDate(today) {
  const abbreviatedWeekDaysEnglishArr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu'];
  const abbreviatedWeekDaysRussianArr = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт'];
  const abbreviatedWeekDaysBelarussianArr = ['Нд', 'Пн', 'Аў', 'Ср', 'Чц', 'Пт', 'Сб', 'Нд', 'Пн', 'Аў'];

  const weekDaysEnglishArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
  const weekDaysRussianArr = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье', 'Понедельник', 'Вторник'];
  const weekDaysBelarussianArr = ['Нядзеля', 'Панядзелак', 'Аўторак', 'Серада', 'Чацвер', 'Пятніца', 'Субота', 'Нядзеля', 'Панядзелак', 'Аўторак'];

  const monthEnglishNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthRussianNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  const monthBelarussianNames = ['Студзеня', 'Лютага', 'Сакавіка', 'Красавіка', 'Мая', 'Чэрвеня', 'Ліпеня', 'Жніўня', 'Верасня', 'Кастрычніка', 'Лістапада', 'Снежня'];

  let weekDaysArr;
  let abbreviatedweekDaysArr;
  let month;
  if (userSettings.language === 'en') {
    weekDaysArr = weekDaysEnglishArr;
    abbreviatedweekDaysArr = abbreviatedWeekDaysEnglishArr;
    month = monthEnglishNames[today.getMonth()];
  } else if (userSettings.language === 'ru') {
    weekDaysArr = weekDaysRussianArr;
    abbreviatedweekDaysArr = abbreviatedWeekDaysRussianArr;
    month = monthRussianNames[today.getMonth()];
  } else if (userSettings.language === 'be') {
    weekDaysArr = weekDaysBelarussianArr;
    abbreviatedweekDaysArr = abbreviatedWeekDaysBelarussianArr;
    month = monthBelarussianNames[today.getMonth()];
  }

  const weekDay = today.getDay();
  const todayWeekDay = abbreviatedweekDaysArr[weekDay];
  const nextWeekDay = weekDaysArr[weekDay + 1];
  const nextSecondWeekDay = weekDaysArr[weekDay + 2];
  const nextThirdWeekDay = weekDaysArr[weekDay + 3];
  const day = today.getDate();

  document.querySelector('.current-date').innerHTML = `${todayWeekDay} ${day} ${month}`;
  document.querySelector('.next-day').innerHTML = nextWeekDay;
  document.querySelector('.next-second-day').innerHTML = nextSecondWeekDay;
  document.querySelector('.next-third-day').innerHTML = nextThirdWeekDay;
}

async function getLocalDate(latitude, longitude) {
  const url = `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=alex_klim`;

  const response = await fetch(url);
  const data = await response.json();

  const processData = (processingDdata) => {
    const localDate = new Date(new Date().toLocaleString('en-US', { timeZone: processingDdata.timezoneId }));
    userSettings.localDate = localDate;
    getCurrentDate(localDate);
    startTime(localDate);
    if (userSettings.language === 'en') {
      document.querySelector('.local-time').innerHTML = 'Local TIME ';
    } else if (userSettings.language === 'ru') {
      document.querySelector('.local-time').innerHTML = 'Местное ВРЕМЯ ';
    } else if (userSettings.language === 'be') {
      document.querySelector('.local-time').innerHTML = 'Мясцовы ЧАС ';
    }
  };
  processData(await data);

  return Promise.all([data]);
}

function getLinkToImage() {
  const seasonArr = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const dayTimeArr = ['night', 'morning', 'day', 'evening'];

  const today = userSettings.localDate;
  const season = seasonArr[Math.floor(today.getMonth())];
  const dayTime = dayTimeArr[Math.floor(today.getHours() / 6)];
  const location = userSettings.coordinates.locationName;
  const { weather } = userSettings;

  const url = `https://api.unsplash.com/photos/random?query=${season},${dayTime},${weather},${location}&client_id=b92f5f52988366cf4c1e8ec7be7d22faef5dddde306e812fbd18fafa7ff369ec`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.querySelector('.body').style.background = `url('${data.urls.small}') center center / cover no-repeat fixed`;
    });
}

const weatherImage = document.querySelector('.weather-image');
async function getWeatherImage(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=en&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;

  const response = await fetch(url);
  const data = await response.json();

  let urlForImage;
  function processData(processingData) {
    const description = processingData.weather[0].main.toLowerCase();
    if (description === 'clear') {
      urlForImage = 'https://openweathermap.org/img/wn/01n@2x.png';
    } else if (description === 'scattered clouds') {
      urlForImage = 'https://openweathermap.org/img/wn/02n@2x.png';
    } else if (description === 'clouds') {
      urlForImage = 'https://openweathermap.org/img/wn/04n@2x.png';
    } else if (description === 'drizzle') {
      urlForImage = 'https://openweathermap.org/img/wn/09n@2x.png';
    } else if (description === 'rain') {
      urlForImage = 'https://openweathermap.org/img/wn/10n@2x.png';
    } else if (description === 'thunderstorm') {
      urlForImage = 'https://openweathermap.org/img/wn/11n@2x.png';
    } else if (description === 'snow') {
      urlForImage = 'https://openweathermap.org/img/wn/13n@2x.png';
    } else {
      urlForImage = 'https://openweathermap.org/img/wn/50n@2x.png';
    }
    weatherImage.src = urlForImage;
    weatherImage.classList.remove('hidden');
  }
  processData(await data);
}

function convertWeatherDescriptionToImage(weatherDescription) {
  const description = weatherDescription.toLowerCase();
  let urlForImage;
  if (description === 'clear') {
    urlForImage = 'https://openweathermap.org/img/wn/01n.png';
  } else if (description === 'scattered clouds') {
    urlForImage = 'https://openweathermap.org/img/wn/02n.png';
  } else if (description === 'clouds') {
    urlForImage = 'https://openweathermap.org/img/wn/04n.png';
  } else if (description === 'drizzle') {
    urlForImage = 'https://openweathermap.org/img/wn/09n.png';
  } else if (description === 'rain') {
    urlForImage = 'https://openweathermap.org/img/wn/10n.png';
  } else if (description === 'thunderstorm') {
    urlForImage = 'https://openweathermap.org/img/wn/11n.png';
  } else if (description === 'snow') {
    urlForImage = 'https://openweathermap.org/img/wn/13n.png';
  } else {
    urlForImage = 'https://openweathermap.org/img/wn/50n.png';
  }
  return urlForImage;
}

const nextDayWeatherImage = document.querySelector('.next-day-weather-image');
const nextSecondDayWeatherImage = document.querySelector('.next-second-day-weather-image');
const nextThirdDayWeatherImage = document.querySelector('.next-third-day-weather-image');
async function getNextDaysWeatherImages(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=en&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;

  const response = await fetch(url);
  const data = await response.json();

  function processData(processingData) {
    const nextDayWeatherImageUrl = convertWeatherDescriptionToImage(
      processingData.list[7].weather[0].main,
    );
    const nextSecondDayWeatherImageUrl = convertWeatherDescriptionToImage(
      processingData.list[15].weather[0].main,
    );
    const nextThirdDayWeatherImageUrl = convertWeatherDescriptionToImage(
      processingData.list[23].weather[0].main,
    );

    nextDayWeatherImage.src = nextDayWeatherImageUrl;
    nextSecondDayWeatherImage.src = nextSecondDayWeatherImageUrl;
    nextThirdDayWeatherImage.src = nextThirdDayWeatherImageUrl;

    nextDayWeatherImage.classList.remove('hidden');
    nextSecondDayWeatherImage.classList.remove('hidden');
    nextThirdDayWeatherImage.classList.remove('hidden');
  }
  processData(await data);
}

function convertCelsiusToFahrenheit(temp) {
  return Math.round(((temp * 9) / 5) + 32);
}

async function getWeather(latitude, longitude) {
  let urlWeatherToday;
  let urlWeatherNextDays;
  const lang = {
    pressure: undefined,
    hpa: undefined,
    wind: undefined,
    ms: undefined,
    humidity: undefined,
  };
  if (userSettings.language === 'en') {
    urlWeatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=en&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    urlWeatherNextDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=en&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    lang.pressure = 'Pressure:';
    lang.hpa = 'hpa';
    lang.wind = 'Wind:';
    lang.ms = 'm/s';
    lang.humidity = 'Humidity:';
  } else if (userSettings.language === 'ru') {
    urlWeatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=ru&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    urlWeatherNextDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=ru&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    lang.pressure = 'Давление:';
    lang.hpa = 'гПа';
    lang.wind = 'Ветер:';
    lang.ms = 'м/сек';
    lang.humidity = 'Влажность:';
  } else if (userSettings.language === 'be') {
    urlWeatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=ru&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    urlWeatherNextDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=be&units=metric&APPID=3df95dd014e72dd39f516f04ab34b874`;
    lang.pressure = 'Ціск:';
    lang.hpa = 'гПа';
    lang.wind = 'Вецер:';
    lang.ms = 'м/сек';
    lang.humidity = 'Вільготнасць:';
  }

  // Today's Weather:
  const todaysWeatherResponse = await fetch(urlWeatherToday);
  const todaysWeatherData = await todaysWeatherResponse.json();

  const processTodaysWeatherData = (data) => {
    const temperature = Math.round(data.main.temp);
    const cloudiness = data.weather[0].description;
    const { pressure } = data.main;
    const wind = data.wind.speed;
    const { humidity } = data.main;

    let todayTemp;
    if (userSettings.temperature === 'Celsius') {
      todayTemp = `${temperature}&deg;C`;
    } else if (userSettings.temperature === 'Fahrenheit') {
      todayTemp = `${convertCelsiusToFahrenheit(temperature)}&deg;F`;
    }
    document.querySelector('.current-temperature').innerHTML = todayTemp;

    userSettings.weather = cloudiness;
    document.querySelector('.current-weather__cloudiness').innerHTML = cloudiness.toUpperCase();
    document.querySelector('.current-weather__pressure').innerHTML = `${lang.pressure} ${pressure} ${lang.hpa}`;
    document.querySelector('.current-weather__wind').innerHTML = `${lang.wind} ${wind} ${lang.ms}`;
    document.querySelector('.current-weather__humidity').innerHTML = `${lang.humidity} ${humidity}%`;
  };
  processTodaysWeatherData(await todaysWeatherData);

  // Weather for three next days:
  const nextDaysWeatherResponse = await fetch(urlWeatherNextDays);
  const nextDaysWeatherData = await nextDaysWeatherResponse.json();

  const processNextDaysWeatherData = (data) => {
    let nextDayTemp;
    let nextSecondDayTemp;
    let nextThirdDayTemp;
    if (userSettings.temperature === 'Celsius') {
      nextDayTemp = `${Math.round(data.list[7].main.temp)}&deg;C`;
      nextSecondDayTemp = `${Math.round(data.list[15].main.temp)}&deg;C`;
      nextThirdDayTemp = `${Math.round(data.list[23].main.temp)}&deg;C`;
    } else if (userSettings.temperature === 'Fahrenheit') {
      nextDayTemp = `${convertCelsiusToFahrenheit(Math.round(data.list[7].main.temp))}&deg;F`;
      nextSecondDayTemp = `${convertCelsiusToFahrenheit(Math.round(data.list[15].main.temp))}&deg;F`;
      nextThirdDayTemp = `${convertCelsiusToFahrenheit(Math.round(data.list[23].main.temp))}&deg;F`;
    }
    document.querySelector('.temperature-next-day').innerHTML = nextDayTemp;
    document.querySelector('.temperature-next-second-day').innerHTML = nextSecondDayTemp;
    document.querySelector('.temperature-next-third-day').innerHTML = nextThirdDayTemp;
  };
  processNextDaysWeatherData(await nextDaysWeatherData);

  getWeatherImage(latitude, longitude);
  getNextDaysWeatherImages(latitude, longitude);

  return Promise.all([todaysWeatherData, nextDaysWeatherData]);
}

function translateAndSetLocationName() {
  const url = `https://api.opencagedata.com/geocode/v1/json?key=874c181d9cc34c25973b973a971e7893&q=${userSettings.coordinates.latitude}+${userSettings.coordinates.longitude}&language=${userSettings.language}&pretty=1&no_annotations=1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results[0].components.hasOwnProperty('city')) {
        userSettings.coordinates.locationName = `${data.results[0].components.city}, ${data.results[0].components.country}`;
        document.querySelector('.location').innerHTML = userSettings.coordinates.locationName;
      } else if (data.results[0].components.hasOwnProperty('state')) {
        userSettings.coordinates.locationName = `${data.results[0].components.state}, ${data.results[0].components.country}`;
        document.querySelector('.location').innerHTML = userSettings.coordinates.locationName;
      } else if (data.results[0].components.hasOwnProperty('county')) {
        userSettings.coordinates.locationName = `${data.results[0].components.county}, ${data.results[0].components.country}`;
        document.querySelector('.location').innerHTML = userSettings.coordinates.locationName;
      } else {
        userSettings.coordinates.locationName = `${data.results[0].formatted}`;
        document.querySelector('.location').innerHTML = userSettings.coordinates.locationName;
      }
    });
}

function numToDegMin(num) {
  const number = parseFloat(num);
  const arrDegMin = number.toFixed(2).toString().split('.');
  const degs = arrDegMin[0];
  const mins = arrDegMin[1];
  return `${degs}${String.fromCharCode(176)}${mins}'`;
}

function translateLatitudeAndLongitude(latitude, longitude) {
  let latitudeTranslatedTitle = 'Latitude';
  let longitudeTranslatedTitle = 'Longitude';
  if (userSettings.language === 'ru') {
    latitudeTranslatedTitle = 'Широта';
    longitudeTranslatedTitle = 'Долгота';
  } else if (userSettings.language === 'be') {
    latitudeTranslatedTitle = 'Шырата';
    longitudeTranslatedTitle = 'Даўгата';
  }

  const latitudeDegMinFormat = numToDegMin(latitude);
  const longitudeDegMinFormat = numToDegMin(longitude);
  document.querySelector('.location-data__latitude').innerHTML = `${latitudeTranslatedTitle}: ${latitudeDegMinFormat}`;
  document.querySelector('.location-data__longitude').innerHTML = `${longitudeTranslatedTitle}: ${longitudeDegMinFormat}`;
}

const englishLangButton = document.querySelector('.english-language-button');
const russianLangButton = document.querySelector('.russian-language-button');
const belorussianLangButton = document.querySelector('.belorussian-language-button');

function changeLangToEnglish() {
  userSettings.language = 'en';
  recognition.lang = 'en-US';
  userSettings.voiceSearchLanguage = 'en-US';
  searchButton.innerHTML = 'Search';
  englishLangButton.classList.add('pressed');
  russianLangButton.classList.remove('pressed');
  belorussianLangButton.classList.remove('pressed');
  if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
    getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    translateAndSetLocationName();
    translateLatitudeAndLongitude(
      userSettings.coordinates.latitude, userSettings.coordinates.longitude,
    );
  }
  localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
}
englishLangButton.addEventListener('click', changeLangToEnglish);

function changeLangToRussian() {
  userSettings.language = 'ru';
  recognition.lang = 'ru-RU';
  userSettings.voiceSearchLanguage = 'ru-RU';
  searchButton.innerHTML = 'Поиск';
  russianLangButton.classList.add('pressed');
  englishLangButton.classList.remove('pressed');
  belorussianLangButton.classList.remove('pressed');
  if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
    getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    translateAndSetLocationName();
    translateLatitudeAndLongitude(
      userSettings.coordinates.latitude, userSettings.coordinates.longitude,
    );
  }
  localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
}
russianLangButton.addEventListener('click', changeLangToRussian);

function changeLangToBelarussian() {
  userSettings.language = 'be';
  recognition.lang = 'be-BY';
  userSettings.voiceSearchLanguage = 'be-BY';
  searchButton.innerHTML = 'Пошук';
  belorussianLangButton.classList.add('pressed');
  englishLangButton.classList.remove('pressed');
  russianLangButton.classList.remove('pressed');
  if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
    getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    translateAndSetLocationName();
    translateLatitudeAndLongitude(
      userSettings.coordinates.latitude, userSettings.coordinates.longitude,
    );
  }
  localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
}
belorussianLangButton.addEventListener('click', changeLangToBelarussian);

function clearSearchData(event) {
  if (event.key === 'Enter') {
    getGeoLocation();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    return undefined;
  } else {
    while (locationOptions.firstChild) {
      locationOptions.style.maxHeight = null;
      locationOptions.style.bottom = null;
      locationOptions.removeChild(locationOptions.firstChild);
    }
  }
  return undefined;
}

input.addEventListener('keydown', clearSearchData);
document.addEventListener('click', clearSearchData);

let map;
function setMapLocation(latitude, longitude) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleC1rbGltIiwiYSI6ImNrM3p2czlnazF0dm0zam9wNmkycGM5NTAifQ.gH6N3V3DqSb6e151QosWZg';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude, latitude],
    zoom: 9,
  });
  translateLatitudeAndLongitude(latitude, longitude);
}

function setLocationName() {
  document.querySelector('.location').innerHTML = userSettings.coordinates.locationName;
}

function getClickedOption(event) {
  const chosenOption = event.target;
  if (chosenOption.coordinates) {
    userSettings.coordinates.locationName = chosenOption.coordinates.locationName;
    userSettings.coordinates.latitude = chosenOption.coordinates.latitude;
    userSettings.coordinates.longitude = chosenOption.coordinates.longitude;

    translateLatitudeAndLongitude(
      userSettings.coordinates.latitude, userSettings.coordinates.longitude,
    );

    setMapLocation(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    setLocationName(userSettings.coordinates.locationName);

    Promise.all([
      getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
      getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
    ]).then(() => {
      getLinkToImage();
    });

    localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
  }
}
locationOptions.addEventListener('click', getClickedOption);

const refreshTimeAndWeatherData = () => {
  if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
    getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
  }
};
setInterval(refreshTimeAndWeatherData, 60000);

const refreshButton = document.querySelector('.refresh-button');
function refreshData() {
  if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
    Promise.all([
      getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
      getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
    ]).then(() => {
      getLinkToImage();
    });
  }
}
refreshButton.addEventListener('click', refreshData);

const buttonCelsius = document.querySelector('.button-celsius');
const buttonFahrenheit = document.querySelector('.button-fahrenheit');
function changeTempToCelsius() {
  if (userSettings.temperature !== 'Celsius') {
    userSettings.temperature = 'Celsius';

    buttonCelsius.classList.add('pressed');
    buttonFahrenheit.classList.remove('pressed');

    if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
      getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    }
    localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
  }
}
function changeTempToFahrenheit() {
  if (userSettings.temperature !== 'Fahrenheit') {
    userSettings.temperature = 'Fahrenheit';
    buttonFahrenheit.classList.add('pressed');
    buttonCelsius.classList.remove('pressed');
    if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
      getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    }
    localStorage.setItem('userSettingsFancyWeather', JSON.stringify(userSettings));
  }
}
buttonCelsius.addEventListener('click', changeTempToCelsius);
buttonFahrenheit.addEventListener('click', changeTempToFahrenheit);

async function getIpLocationCoordinates() {
  const url = 'https://ipinfo.io?token=5c0444f4b40287';

  const response = await fetch(url);
  const data = await response.json();

  const processData = (processingData) => {
    const location = processingData.loc;
    const locationArr = location.split(',');
    userSettings.coordinates.latitude = locationArr[0];
    userSettings.coordinates.longitude = locationArr[1];
    setMapLocation(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    translateAndSetLocationName();
    Promise.all([
      getWeather(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
      getLocalDate(userSettings.coordinates.latitude, userSettings.coordinates.longitude),
    ]).then(() => {
      getLinkToImage();
      document.querySelector('.main').classList.remove('hidden');
    });
  };
  processData(await data);
}

function loadFromLocalStorage() {
  const storedItem = localStorage.getItem('userSettingsFancyWeather');
  if (storedItem) {
    userSettings = JSON.parse(storedItem);

    if (userSettings.temperature === 'Celsius') {
      buttonCelsius.classList.add('pressed');
      buttonFahrenheit.classList.remove('pressed');
    } else if (userSettings.temperature === 'Fahrenheit') {
      buttonFahrenheit.classList.add('pressed');
      buttonCelsius.classList.remove('pressed');
    }

    if (userSettings.language === 'en') {
      changeLangToEnglish();
    } else if (userSettings.language === 'ru') {
      changeLangToRussian();
    } else if (userSettings.language === 'be') {
      changeLangToBelarussian();
    }

    if (userSettings.coordinates.latitude && userSettings.coordinates.longitude) {
      setMapLocation(userSettings.coordinates.latitude, userSettings.coordinates.longitude);
    }

    refreshData();

    document.querySelector('.main').classList.remove('hidden');
  } else {
    getIpLocationCoordinates();
  }
}

window.addEventListener('DOMContentLoaded', loadFromLocalStorage);
