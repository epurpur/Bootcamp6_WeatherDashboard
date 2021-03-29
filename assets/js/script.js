

//link to OpenWeatherMap API docs: https://openweathermap.org/api
//my openweathermap api key
var api_key = '333de4e909a5ffe9bfa46f0f89cad105'


$('#searchBtn').click(function() {
    var cityName = $('input').val();

    //reset search text to empty
    $('input').val('');
    
    //draw HTML for today's weather card     
    makeTodaysHTML();

    //make API request for today's weather
    getTodaysWeather(cityName);

    //add search value to list of Recent Searches
    addRecentSearch(cityName);
});


/** 
 * TODAY'S WEATHER FUNCTIONS
 */


//get today's weather data by city
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
function getTodaysWeather(cityName) {
    //construct URL using cityName, passed from button click, and API key
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=imperial`

    // make API request for today's weather forecast in requested city
    fetch(url)
        .then(function (response) {
            if (response.ok) {             //if user input is a valid city name
                return response.json(); 
            } else {
                alert('Invalid City Name. Please enter a valid city name');
            }
        })
        .then(function (data) {

            //fill today's weather card with info returned from API call
            fillDailyWeather(data);
        });
}


function addRecentSearch(cityName) {
    //adds current search value to list of recent searches
    //takes cityName as argument when search button is clicked
    var recentSearchLength = $('#recent-searches').children().length;

    if (recentSearchLength < 10) {        // if < 10 recent search items in list, just add new item to list
        $('#recent-searches').prepend(`<li class="list-group-item">${cityName}</li>`);
    } else {                              // if > 10 search items, remove last one and replace with new item
        $('#recent-searches').children().last().remove();
        $('#recent-searches').prepend(`<li class="list-group-item">${cityName}</li>`);
    }
}


function makeTodaysHTML() {
    //makes HTML for Today's weather and prepends it to the results-column
    $('#results-column').prepend(
        '<div id="today-forecast">' +
            '<div id="title-column">' +
                "<h1> Today's Weather </h1>" +
                '<div id="city-title"> City: <span id="city"></span> </div>' +
                '<div id="today-date"> Date: <span id="todayDate"></span> </div>' +
                '<div id="weather-icon"><img src="" id="wIcon" alt="description of weather today"></div>' +
            '</div>' +
            '<div id="weather-info-column">' +
                '<h1> Weather Info </h1>' +
                '<div id="weather-items">' +
                    '<div> Temperature: <span id="temp"></span> F</div>' +
                    '<div> Humidity: <span id="humidity"></span> %</div>' +
                    '<div> Wind Speed: <span id="wind"></span> mph</div>' +
                    '<div> UV Index: <span id="uvi"></span></div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}


function createUVIndex() {
    //creates fake UV index as this information is not easily available via an API request
    //this is a fake value between 0-10

    var randomNum = (Math.random() * 10).toFixed(2)  //rounds to 2 decimal places
    return randomNum
}


function fillDailyWeather(data) {
// Takes API response from getTodaysWeather and fills out the daily weather part of the forecast with that information

    //use response to fill out data in today's weather card
    //these items selected don't require additional evaluation. 
    //I just take the value from the API response and insert into the text for the selected object
    $('#city').text(data.name);                                                                     //city name
    $('#todayDate').text(moment().format('MMMM D YYYY'))                                            //today's date
    $('#temp').text(data.main.temp);                                                                //temperature
    $('#humidity').text(data.main.humidity);                                                        //humidity
    $('#wind').text(data.wind.speed);                                                               //wind speed
            
    // create random UV index. UV index data is no longer easily available from the API so this is my workaround
    var uvIndex = createUVIndex();    
    $('#uvi').text(uvIndex);

    //shades uv index background depending on value (good, medium, bad)
    if (uvIndex <= 3) {
        $('#uvi').css({"backgroundColor": "green", "borderRadius": "5px", "padding": "3px"})
    } else if (uvIndex > 3 && uvIndex <= 6) {
        $('#uvi').css({"backgroundColor": "orange", "borderRadius": "5px", "padding": "3px"})
    } else {
        $('#uvi').css({"backgroundColor": "red", "borderRadius": "5px", "padding": "3px"})
    }

    //sets weather image based on value of conditions
    var conditions = data.weather[0].main.toLowerCase();

    if (conditions == 'clear') {
        $('#wIcon').attr('src', './assets/images/clear.png');
    } else if (conditions == 'clouds') {
        $('#wIcon').attr('src', './assets/images/clouds.png');
    } else if (conditions == 'rain') {
        $('#wIcon').attr('src', './assets/images/rain.png');
    } else if (conditions == 'wind') {
        $('#wIcon').attr('src', './assets/images/wind.png'); 
    } else if (conditions == 'snow') {
        $('#wIcon').attr('src', './assets/images/snow.png'); 
    } else if (conditions == 'extreme') {
        $('#wIcon').attr('src', './assets/images/extreme.png'); 
    } else {
        $('#wIcon').attr('src', './assets/images/extreme.png'); 
    }   
}



/**
 * FIVE DAY FORECAST
 */

var cityName = 'Boone';
function getFiveDayForecast(cityName) {
    //construct URL using cityName, passed from button click, and API key
    var url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}&units=imperial`

    // make API request for today's weather forecast in requested city
    fetch(url)
        .then(function (response) {
            if (response.ok) {             //if user input is a valid city name
                return response.json(); 
            } 
        })
        .then(function (data) {
            console.log(data);
        });
}

getFiveDayForecast(cityName);