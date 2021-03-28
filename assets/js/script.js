

//link to OpenWeatherMap API docs: https://openweathermap.org/api
//my openweathermap api key
var api_key = '333de4e909a5ffe9bfa46f0f89cad105'


//get today's weather data by city
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
function makeTodaysWeather() {
    var cityName = 'Boone'
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=imperial`

    // make API request for today's weather forecast in requested city
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            };
        })
        .then(function (data) {

            //use response to fill out data in today's weather card
            $('#city').text(data.name);
            $('#todayDate').text(moment().format('MMMM D YYYY'))
            $('#temp').text(data.main.temp);
            $('#humidity').text(data.main.humidity);
            $('#wind').text(data.wind.speed);
            
            var uvIndex = createUVIndex();    // create random UV index
            $('#uvi').text(uvIndex);

            //shades uv index background depending on value (good, medium, bad)
            if (uvIndex <= 3) {
                $('#uvi').css({"backgroundColor": "green", "borderRadius": "5px", "padding": "3px"})
            } else if (uvIndex > 3 && uvIndex <= 6) {
                $('#uvi').css({"backgroundColor": "orange", "borderRadius": "5px", "padding": "3px"})
            } else {
                $('#uvi').css({"backgroundColor": "red", "borderRadius": "5px", "padding": "3px"})
            }
        });
}

makeTodaysWeather()


function createUVIndex() {
    //creates fake UV index as this information is not easily available via an API request
    //this is a fake value between 0-10

    var randomNum = (Math.random() * 10).toFixed(2)  //rounds to 2 decimal places
    return randomNum
}

