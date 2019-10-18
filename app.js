// "2cb4e8f443f968c88b7e4e220c7644a0"

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const timeElement = document.querySelector(".date-time p");

const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;

// data from the API
const weather = {};

weather.temperature = {
    unit : "celsius"
}

const kelvin = 273;
const key = "2cb4e8f443f968c88b7e4e220c7644a0"; 

if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> Browser settings do not support geolocation, please change settings. </p>";
    
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    requestWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> ${error.message} </p>";

}

// Function to actually get the weather
function requestWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    // Convert temp to celsius
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - kelvin);
        weather.description = data.weather[0].description;
        weather.description = weather.description.toUpperCase();
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.city = weather.city.toUpperCase();
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
    });
}

// Function to handle rendering/display of weather data
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    timeElement.innerHTML = dateTime;
};

// funciton to convert fahrenheit to celsius
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// executed when user clicks on temp elements
tempElement.addEventListener("click", function(){
    if(weather.temperature.value == undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}<span>C</span>`;
        weather.temperature.unit = "celsius";

    }
})