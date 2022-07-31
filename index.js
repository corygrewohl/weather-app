//API Key: 8100046a314b797814718011c82b3413

const apiKey = "8100046a314b797814718011c82b3413";
let kelvinTemp = 10;
const temperatureDiv = document.getElementById("temperature");
const unitSpan = document.getElementById("unit");

async function getWeather(location) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  );

  if (response.status == 200) {
    let json = await response.json();
    return json;
  }

  throw new Error(response.status);
}

function setDefault(){
    getWeatherHandler("new york")
}

function getWeatherHandler(city){
    getWeather(city).then(data => {
        DOMController.setTemperature(data, true);
        DOMController.convertTime(data)
        DOMController.setTitle(data)
        console.log(data)
    })
}

const cityForm = document.getElementById("city-form");
cityForm.setAttribute("onsubmit", getCity())

function getCity(){
    cityForm?.addEventListener("submit", (event) =>{
        event.preventDefault();

        const EventForm = new FormData(event.target);
        const city = EventForm.get("city");
        getWeatherHandler(city);
    })
}

const DOMController = (() => {

    const setTitle = (data) => {
        const locationTitle = document.getElementById("title")
        locationTitle.textContent = data.name;
    }

    const kelvinToFahrenheit = () => {
        temperatureDiv.textContent = Math.round(((kelvinTemp-273.15)*1.8)+32);
        unitSpan.innerHTML = '°F';
    }

    const kelvinToCelsius = () => {
        temperatureDiv.textContent = Math.round(kelvinTemp-273.15);
        unitSpan.innerHTML = '°C';
        console.log(unitSpan)
    }

    const setTemperature = (data) => {
        kelvinTemp = data.main.temp
        kelvinToFahrenheit(kelvinTemp)

        setupCelsiusButton()
        setupFahrenheitButton()
    }

    const convertTime = (data) => {
        let timeDifference = data.timezone
        timeDifference /= 3600

        let present = new Date().getUTCHours();
        let localHours = present + timeDifference
        if(localHours < 0){
            localHours += 24
        }
        if(localHours >= 20 || localHours < 6){
            const container = document.querySelector(".container");
            container.style.backgroundImage = "url(" + "night.jpg" + ")";
        } else {
            const container = document.querySelector(".container");
            container.style.backgroundImage = "url(" + "day.jpg" + ")";
        }
        //otherwise background is day

        console.log(localHours)
        let localMinutes = new Date().getMinutes()
        console.log(localMinutes)

        return {localHours, localMinutes};
    }

    const convertTemperature = (isFahrenheit) =>{
        if(isFahrenheit){
            kelvinToFahrenheit();
        } else {
            kelvinToCelsius()
        }
    }

    const setupCelsiusButton = () => {
        const celsiusButton = document.getElementById("celsius")
        celsiusButton.setAttribute("onclick", "DOMController.convertTemperature(false)")
    }

    const setupFahrenheitButton = () => {
        const fahrenheitButton = document.getElementById("fahrenheit");
        fahrenheitButton.setAttribute("onclick", "DOMController.convertTemperature(true)")
    }

    return {
        setTemperature,
        convertTemperature,
        convertTime,
        setTitle
    };

})();



setDefault()