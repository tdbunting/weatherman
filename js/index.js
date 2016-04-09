"use strict";

var currentUnit = "imperial";

function getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        getCurrentWeather(position.coords.latitude, position.coords.longitude, currentUnit);
    });
  } else {
    console.log("Cannot determine location");
  }
}

//call the weather api and set result object
function getCurrentWeather(latitude, longitude, unit) {
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=" + unit + "&APPID=8f95f93fa04e5c5c00197fc5679d2604";

  $.getJSON({
    url: url,
    success: function(data) {
      //on success
      updatePage(weatherFormatter(data, unit));
    },
    error: function() {
      //on error
      console.log("Cannot get data");
      
    }
  });
}

//returns needed weather data as basic object
function weatherFormatter(weather, unit) {
  var city = weather.name;
  var country = weather.sys.country;
  var temperature = Math.round(weather.main.temp);
  var condition = titleCase(weather.weather[0].description);
  var icon = weather.weather[0].main.toLowerCase();
  var wind = Math.round(weather.wind.speed);
  var tempLabel = "F";
  var windLabel = "mph"
  
  if(unit === "metric"){
    tempLabel = "C";
    windLabel = "kph"
  }
  
  return {
    "city": city,
    "country": country,
    "temp": temperature + "&deg " + tempLabel,
    "wind": wind + " " + windLabel,
    "condition": condition,
    "icon": icon
  };
}

//updates the page with fetched data
function updatePage(data){
  $("#temperature").html(data.temp);
  $("#condition").html(data.condition);
  $("#location").html(data.city + ", " + data.country);
  $("#windSpeed").html(data.wind);
  setIcon(data.icon);
}

//Capitalize every word in string - for capitalizing condition
function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   return splitStr.join(' '); 
}

//takes in the current weather condition and sets the proper icon class
function setIcon(condition){
  switch(condition){
      case 'drizzle':
        $("#icon").removeClass().addClass("wi wi-cloud");
        break;
      case 'clouds':
        $("#icon").removeClass().addClass("wi wi-cloudy");
        break;
      case 'rain':
        $("#icon").removeClass().addClass("wi wi-rain");
        break;
      case 'snow':
        $("#icon").removeClass().addClass("wi wi-snow");
        break;
      case 'clear':
        $("#icon").removeClass().addClass("wi wi-day-sunny");
        break;
      case 'thunderstom':
        $("#icon").removeClass().addClass("wi wi-thunderstorm");
        break;
      default:
  }
}

$(document).ready(function() {
  getCurrentLocation();
});

$(document).ajaxStart(function() {
  $("#weatherBox").hide();
  $("#buttons").hide();
  $("#loading").show();
});

$(document).ajaxStop(function() {
  $("#loading").hide();
  $("#weatherBox").show();
  $("#buttons").show();
});

$("#imperial").click(function(){
  console.log("imperial clicked");
  currentUnit = "imperial";
  getCurrentLocation();
});

$("#metric").click(function(){
  console.log("metric clicked");
  currentUnit = "metric";
  getCurrentLocation();
});

$(".btn-group[role='group'] button").on('click', function(){
    $(this).siblings().removeClass('active')
    $(this).addClass('active');
})