

/**
 * ON PAGE LOAD     
 */

 $(document).ready(function() {
    
    //read array from localStorage (recentSearches), draw HTML in 'recent searches' for each item in recentSearches array
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    
    recentSearches.reverse();   //for some reason the array is populated backwards when page reloads. So I reverse array to fix this

    // addRecentSearch(cityName)
    $.each(recentSearches, function(index, value) {
        //each value is a city name, takes this value and makes HTML from it
        addRecentSearch(value);
    });

});



/**
 * BUTTONS
 */

//search button functionality
//this is the main functionality of the page
$('#searchBtn').click(function() {
    var cityName = $('input').val();

    //remove HTML for today's weather card if any exists
    $('#today-forecast').remove();

    //reset search text to empty
    $('input').val('');
    
    //draw HTML for today's weather card     
    makeTodaysHTML();

    //make API call for today's weather
    getTodaysWeather(cityName);

    //add search value to list of Recent Searches
    addRecentSearch(cityName);

    //remove HTML for 5 day forecast if any exists
    $('#five-day-forecast-title').remove()
    $('#five-day-forecast-area').remove();

    //draw HTML for 5 day weather forecast
    makeFiveDayHTML()

    //make API call for 5 day weather
    getFiveDayForecast(cityName)

    //log cityName into localStorage
    setToLocalStorage(cityName);
});



//if user clicks on item (button) in 'recent searches' list
//need to use event delegation to make this an active button
$(document).on("click", "#recentSearchBtn", function() {     
    var cityName = $(this).text();    //gets value of city

    //remove HTML for today's weather card if any exists
    $('#today-forecast').remove();

    //reset search text to empty
    $('input').val('');
    
    //draw HTML for today's weather card     
    makeTodaysHTML();

    //make API call for today's weather
    getTodaysWeather(cityName);

    //remove HTML for 5 day forecast if any exists
    $('#five-day-forecast-title').remove()
    $('#five-day-forecast-area').remove();

    //draw HTML for 5 day weather forecast
    makeFiveDayHTML()

    //make API call for 5 day weather
    getFiveDayForecast(cityName)
});



/** 
 * TODAY'S WEATHER FUNCTIONS
 */

//link to OpenWeatherMap API docs: https://openweathermap.org/api
//my openweathermap api key
// var api_key = '333de4e909a5ffe9bfa46f0f89cad105'
var api_key = 'd91f911bcf2c0f925fb6535547a5ddc9'


//get today's weather data by city
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
function getTodaysWeather(cityName) {
    //construct URL using cityName, passed from button click, and API key
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=imperial`

    // make API request for today's weather forecast in requested city
    fetch(url)
        .then(function (response) {
            if (response.ok) {             //if user input is a valid city name
                return response.json(); 
            } else {
                alert('Invalid City Name. Please enter a valid city name');
                return Promise.reject(response)
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
        $('#recent-searches').prepend(`<li class="list-group-item recentSearchBtn"><button id="recentSearchBtn">${cityName}</button></li>`);
    } else {                              // if > 10 search items, remove last one and replace with new item
        $('#recent-searches').children().last().remove();
        $('#recent-searches').prepend(`<li class="list-group-item recentSearchBtn"><button id="recentSearchBtn">${cityName}</button></li>`);
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
    var conditions = data.weather[0].main.toLowerCase();                    // gets value of weather conditions as lower case string
    $('#wIcon').attr('src', `./assets/images/${conditions}.png`)            // inserts conditions value into path of img src attribute

}



/**
 * FIVE DAY FORECAST
 */

function getFiveDayForecast(cityName) {
    //construct URL using cityName, passed from button click, and API key
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}&units=imperial`

    // make API request for today's weather forecast in requested city
    fetch(url)
        .then(function (response) {
            if (response.ok) {             //if user input is a valid city name
                return response.json(); 
            } 
        })
        .then(function (data) {

            //set dates for 5 day forecast
            fillForecastWeather(data);
        });
}



function fillForecastWeather(data) {
    //uses 5 day weather forecast data returned from API call to set data for each card in 5 day forecast

    //sets dates for 5 day forecast
    setFiveDayForecastDates();

    //parse each day's weather from API data. There are 5 items in fiveDayWeather 
    var fiveDayWeather = parseFiveDayForecast(data);

    //select necessary HTML elements
    var tempValue = $('.five-day-temp')
    var humidityValue = $('.five-day-humidity')
        
    //set weather icons 
    $.each(fiveDayWeather, function(index, value) {
        var name = `#wIcon${index}`;                                    //selects ID in HTML
        var path = `./assets/images/${value[0].toLowerCase()}.png`;     //creates path to respective weather image
        $(name).attr('src', path);                                      //sets src attribute of name to path
    });

    //set temperature values
    $.each(tempValue, function(index, value) {
        value = $(value);                                               //convert to jQuery
        value.text(fiveDayWeather[index][1]);                           //item[1] in fiveDayWeather array is temp value
    });

    //set humidity values
    $.each(humidityValue, function(index, value) {
        value = $(value);                                               //convert to jQuery
        value.text(fiveDayWeather[index][2]);                           //item[2] in fiveDayWeather array is temp value
    });

}



function makeFiveDayHTML() {
    // draws HTML for five day forcast section and appends it to results-column under today's forecast HTML
    $('#results-column').append(
        '<h1 id="five-day-forecast-title"> 5 Day Forecast </h1>' +
        '<div id="five-day-forecast-area">' +
            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header">' +
                'Tomorrows Date' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><img src="" class="wIcon5Day" id="wIcon0" alt="description of weather today"></li>' +
                '<li class="list-group-item">Temp: <span class="five-day-temp"></span> F</li>' +
                '<li class="list-group-item">Humidity: <span class="five-day-humidity"></span>%</li>' +
            '</ul>' +
            '</div>' +

            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header">' +
                '+2 Days' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><img src="" class="wIcon5Day" id="wIcon1" alt="description of weather today"></li>' +
                '<li class="list-group-item">Temp: <span class="five-day-temp"></span> F</li>' +
                '<li class="list-group-item">Humidity: <span class="five-day-humidity"></span>%</li>' +
            '</ul>' +
            '</div>' +

            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header">' +
                '+3 Days' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><img src="" class="wIcon5Day" id="wIcon2" alt="description of weather today"></li>' +
                '<li class="list-group-item">Temp: <span class="five-day-temp"></span> F</li>' +
                '<li class="list-group-item">Humidity: <span class="five-day-humidity"></span>%</li>' +
            '</ul>' +
            '</div>' +

            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header">' +
                '+4 Days' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><img src="" class="wIcon5Day" id="wIcon3" alt="description of weather today"></li>' +
                '<li class="list-group-item">Temp: <span class="five-day-temp"></span> F</li>' +
                '<li class="list-group-item">Humidity: <span class="five-day-humidity"></span>%</li>' +
            '</ul>' +
            '</div>' +

            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header">' +
                '+5 Days' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><img src="" class="wIcon5Day" id="wIcon4" alt="description of weather today"></li>' +
                '<li class="list-group-item">Temp: <span class="five-day-temp"></span> F</li>' +
                '<li class="list-group-item">Humidity: <span class="five-day-humidity"></span>%</li>' +
            '</ul>' +
            '</div>' +
        '</div>'
    );
}



function parseFiveDayForecast(data) {
    //parses JSON response from API call for five day forecast
    //Weather data returned in 3 hour increments for 5 days. Each 8 items in data.list is one day's weather
    
    //sets each item of allDaysRawData array to first 8 items of response. 40 responses / 5 days / 3 hour increments = 8 items
    var allDaysRawData = [data.list.slice(0, 8), data.list.slice(8, 16), data.list.slice(16, 24), data.list.slice(24, 32), data.list.slice(32, 40)]

    //sets array to each item of allDaysFinalData for each day in 5 day forecast
    //each item in allDaysFinalData looks like: ["Clouds", "48.07", "53.75"]
    var allDaysFinalData = [];

    //iterates through raw data response from API call. Each item is one day's values
    $.each(allDaysRawData, function(index, item) {
        var temps = 0;                                      //accumulator for each day's temperature values
        var humidity = 0;                                   //accumulator for each day's humidity values
        var weatherDescription;
    
        //iterates through each day's values. 8 values per day
        $.each(item, function(i, value) {
            temps += value.main.temp;
            humidity += value.main.humidity;

            if (i == 0) {
                weatherDescription = item[0].weather[0].main;   //sets weather description to first value of first weather item
            }
        });
        
        temps = (temps / item.length).toFixed(2)            //get average temperature value, round to 2 decimal places
        humidity = (humidity / item.length).toFixed(2)      //get average humidity value, round to 2 decimal places
        
        //finally, package weatherDescription, temps, humidity together and push to allDaysFinalData array
        allDaysFinalData.push([weatherDescription, temps, humidity]);        
    });
    
    return allDaysFinalData;
}



function setFiveDayForecastDates() {
    //sets dates for five day forcast into each respective card
    
    var dateRange = []

    //dates come from moment.js library and formatted accordingly
    var tomorrow = moment().add(1, 'days').format('MMMM D');
    var twoDays = moment().add(2, 'days').format('MMMM D');
    var threeDays = moment().add(3, 'days').format('MMMM D')
    var fourDays = moment().add(4, 'days').format('MMMM D')
    var fiveDays = moment().add(5, 'days').format('MMMM D')
    
    //add all dates to dateRange array
    dateRange.push(tomorrow, twoDays, threeDays, fourDays, fiveDays);
    
    //set dates to .card-header tags in html
    var cardHeaders = $('.card-header');
    $.each(cardHeaders, function(index, value) {
        value = $(value);                       //convert to jquery object
        value.text(dateRange[index]);           //while looping through eaach value, use index of dateRange to set text of value
    });
}



/**
 * LOCAL STORAGE FUNCTION 
 */

function setToLocalStorage(cityName) {
    
    //retrieve recentSearches item from localStorage. If none exist, returns empty array
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    
    if (recentSearches.length < 10) {
        recentSearches.unshift(cityName);   //adds cityName to front of array
    } else {
        recentSearches.pop()                //removes last item from array
        recentSearches.unshift(cityName)    //adds cityName to front of array
    }

    //set recentSearches to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}


