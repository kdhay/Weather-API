
//We intialize the map first and sets its initial view to the US
var map = L.map('map').setView([37.8, -96], 4);

//We intialize the pin marker for our location selection
var marker;

//We initialize our music player to the HTML element musicPlayer
var musicPlayer = document.getElementById('musicPlayer');

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

//////////

// Function to get the background image URL based on weather conditions
function getBackgroundImage(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
            return 'images/clear_sky_bg.jpeg'; // Background image for clear sky
        case 'few clouds':
            return 'images/few_clouds_bg.jpeg'; // Background image for few clouds
        case 'scattered clouds':
            return 'images/scattered_clouds_bg.jpeg'; // Background image for scattered clouds
        case 'broken clouds':
            return 'images/broken_clouds_bg.jpeg'; // Background image for broken clouds
        case 'overcast clouds':
            return 'images/overcast_bg.jpeg'; // Background image for overcast clouds
        case 'shower rain':
            return 'images/shower_rain_bg.jpeg'; // Background image for shower rain
        case 'light rain':
            return 'images/rain_bg.jpeg'; // Background image for rain
        case 'thunderstorm':
            return 'images/thunderstorm_bg.jpeg'; // Background image for thunderstorm
        case 'snow':
            return 'images/snow_bg.jpeg'; // Background image for snow
        default:
            return 'images/default_weather_bg.jpeg'; // Default background image
    }
}

//////////
//Adds a click event for whenever the user clicks on map
map.on('click', function(e) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);

    //Fetch weather data from OpenWeatherMap API
    //Code on how to make an API call to Weather data
    //Latitude and longitude coordinaed from click event
    var apiKey = '63b38e13bf8545fa47c4edb8c538e14f';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng + '&appid=' + apiKey;


    //API call using fetch
    fetch(apiUrl)
        //Checks to see if API call was successful
        .then(response => response.json())

        //Parses the data into this object
        .then(data => {

            //Display current weather information based on API document
            var weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `
                <h2>Current Weather</h2>
                <p>Location: ${data.name}</p>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)} °C</p>
                <p>Weather: ${data.weather[0].description}</p>`;

    
            // Define the icon based on the weather condition
            var weatherIconUrl = getWeatherIcon(data.weather[0].description);
            
            ////
            var backgroundUrl = getBackgroundImage(data.weather[0].description);
            document.getElementById('weather-display').style.backgroundImage = `url('${backgroundUrl}')`;
            ////

            // Create a custom icon
            var customIcon = L.icon({
                iconUrl: weatherIconUrl,
                iconSize: [50, 50], // Increase size from [30, 30] to [50, 50]
                iconAnchor: [25, 25], // Adjust anchor to match the new size
                popupAnchor: [0, -25] // Adjust popup anchor as needed
            });            

             // Check if a marker already exists and update or create new
            if (marker) {
                marker.setIcon(customIcon);
                marker.setLatLng(e.latlng);
            } else {
            marker = L.marker(e.latlng, {icon: customIcon}).addTo(map);
            }

            // Optionally adjust the map view
            map.setView(e.latlng, 10);

            // Play music based on weather condition
            playMusic(data.weather[0].description);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});

document.getElementById('locate-me').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLatlng = new L.LatLng(position.coords.latitude, position.coords.longitude);

            // Remove the existing marker if it exists
            if (marker) {
                map.removeLayer(marker);
            }
            // Create a new marker and set the map's view to the user's location
            marker = L.marker(userLatlng).addTo(map);
            map.setView(userLatlng, 10); // Adjust zoom level as necessary

            // Fetching and displaying weather data at this location
            var apiKey = '63b38e13bf8545fa47c4edb8c538e14f';
            var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLatlng.lat}&lon=${userLatlng.lng}&appid=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    var weatherInfo = document.getElementById('weather-info');
                    weatherInfo.innerHTML = `
                        <h2>Current Weather</h2>
                        <p>Location: ${data.name}</p>
                        <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)} °C</p>
                        <p>Weather: ${data.weather[0].description}</p>
                    `;

                    // Update the background based on the weather condition
                    var backgroundUrl = getBackgroundImage(data.weather[0].description);
                    document.getElementById('weather-display').style.backgroundImage = `url('${backgroundUrl}')`;

                    var weatherIconUrl = getWeatherIcon(data.weather[0].description);
                    var customIcon = L.icon({
                        iconUrl: weatherIconUrl,
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                        popupAnchor: [0, -25]
                    });

                    // Update the marker icon
                    marker.setIcon(customIcon);

                    // Play music based on the weather condition
                    playMusic(data.weather[0].description);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });

        }, function(error) {
            console.error('Geolocation error:', error.message);
            alert('Geolocation error: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});



function getWeatherIcon(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
            return 'icons/sun.jpeg'; // Icon for clear sky
        case 'few clouds':
            return 'icons/light_clouds.jpeg'; // Icon for light clouds
        case 'overcast clouds':
            return 'icons/overcast.jpeg'; // Icon for light clouds
        case 'scattered clouds':
            return 'icons/scattered_clouds.jpeg'; // Icon for scattered clouds
        case 'broken clouds':
            return 'icons/broken_clouds.jpeg'; // Icon for broken clouds
        case 'shower rain':
            return 'icons/light_rain.jpeg'; // Icon for light rain showers
        case 'light rain':
            return 'icons/light_rain.png'; // Icon for moderate to heavy rain
        case 'rain':
            return 'icons/rain.jpeg';
        case 'thunderstorm':
            return 'icons/thunderstorm.jpeg'; // Icon for thunderstorms
        case 'snow':
            return 'icons/snow.jpeg'; // Icon for snow
        default:
            return 'icons/default.jpeg'; // Default icon if no specific match found
    }
}

// Function to play music based on weather condition
function playMusic(weatherCondition) {
    var song;

    switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
            song = 'music/clear.mp3'; // Ideally something bright and sunny
            break;
        case 'few clouds':
            song = 'music/light_clouds.mp3'; // Light, airy music for slight cloudiness
            break;
        case 'scattered clouds':
            song = 'music/partly_cloudy.mp3'; // A bit more dynamic, reflecting changeable weather
            break;
            case 'overcast clouds':
                song = 'music/overcast.mp3'; // More overcast, a heavier tone
                break;    
        case 'broken clouds':
            song = 'music/mostly_cloudy.mp3'; // More overcast, a heavier tone
            break;
        case 'shower rain':
            song = 'music/light_rain.mp3'; // Gentle, relaxing rain sounds
            break;
        case 'rain':
            song = 'music/heavy_rain.mp3'; // Intense, heavier rain sounds
            break;
        case 'thunderstorm':
            song = 'music/thunderstorms.mp3'; // Dramatic and intense, with thunder sounds
            break;
        case 'snow':
            song = 'music/snowfall.mp3'; // Calm and serene, evoking a quiet snowy day
            break;
        default:
            song = 'music/default.mp3'; // Default music for unhandled conditions
            break;
    }


    // Set the source of the audio element to the selected song and play it
    musicPlayer.src = song;
    musicPlayer.play();
}
