const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const suffixes = ['st', 'nd', 'rd', 'th'];
const WEATHER_API_KEY = 'eb09afdff41fc02c8ba1af17dcf7c9d0';
const TIME_API_KEY = '64WKBHY74EJ9';

const city = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');
const date = document.getElementById('date');
const time = document.getElementById('time');
const weatherPanel = document.getElementById('weatherPanel');
const errorPanel = document.getElementById('errorPanel');
const err_title = document.getElementById('err_title');
const err_code = document.getElementById('err_code');
const err_desc = document.getElementById('err_desc');

weatherPanel.style.display = 'none';
errorPanel.style.display = 'none';

const processTime = async (apiDateObj) => {
    let suffix = '';
    let meridian = '';
    const dtObj = await apiDateObj;
    const dateObj = new Date(dtObj.formatted);
    
    // Check for appropriate suffix
    if(dateObj.getDate() === 1 || dateObj.getDate() === 21 || dateObj.getDate() === 31)
        suffix = suffixes[0];
    else if(dateObj.getDate() === 2 || dateObj.getDate() === 22)
        suffix = suffixes[1];
    else if(dateObj.getDate() === 3 || dateObj.getDate() === 23)
        suffix = suffixes[2];
    else
        suffix = suffixes[3];
    
    date.innerHTML = `${days[dateObj.getDay()]}, ${dateObj.getDate()}<sup>${suffix}</sup> ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    // Check for appropriate meridian
    if(dateObj.getHours() >= 12)
        meridian = 'PM';
    else
        meridian = 'AM';
    
    const hrs = dateObj.getHours() < 10 ? dateObj.getHours().toString().padStart(2, '0') : dateObj.getHours();
    const mins = dateObj.getMinutes() < 10 ? dateObj.getMinutes().toString().padStart(2, '0') : dateObj.getMinutes();
    
    time.innerHTML = `${hrs > 12 ? hrs - 12 : hrs}:${mins} ${meridian}`;
}

setInterval(() => {
    fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_API_KEY}&format=json&by=zone&zone=Asia/Kolkata`).then((data) => processTime(data.json())).catch((error) => {
        // In this case, log the error on the console
        console.log(`An error occurred while fetching the time in IST. Displaying the local time on the weather information panel.\n${error}`);

        // Display the local (system's) date
        const local_datetime = new Date();
        date.innerText = `Local Date: ${days[local_datetime.getDay()]}, ${months[local_datetime.getMonth()]} ${local_datetime.getDate()}, ${local_datetime.getFullYear()}`;
        
        // Display the local (system's) time
        const hours = local_datetime.getHours() < 10 ? local_datetime.getHours().toString().padStart(2, '0') : local_datetime.getHours();
        const minutes = local_datetime.getMinutes() < 10 ? local_datetime.getMinutes().toString().padStart(2, '0') : local_datetime.getMinutes();
        time.innerText = `Local Time: ${hours}:${minutes}`;
    });
}, 2000);

const toTitleCase = (str) => (str.replace(/\w\S*/g, (text) => (text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())));

const getWeather = async(e) => {
    e.preventDefault();
    weatherPanel.style.display = 'none';
    errorPanel.style.display = 'none';
    if(city.value === ""){
        err_title.innerText = 'Blank Input';
        err_code.innerText = '400';
        err_desc.innerText = 'Please enter a city name to look for its weather!';
        errorPanel.style.display = 'block';
    }else{
        try {
            const GEO_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city.value},IN&limit=1&appid=${WEATHER_API_KEY}`;
            const geo_resp = await fetch(GEO_API_URL);
            const geo_data = await geo_resp.json();
            if(geo_data && geo_data.length){
                try {
                    const latt = geo_data[0].lat;
                    const long = geo_data[0].lon;
                    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`;
                    const weather_resp = await fetch(WEATHER_API_URL);
                    const weather_data = await weather_resp.json();
                    if(weather_data.cod === 200){
                        const loc = document.getElementById('loc');
                        const temp = document.getElementById('temp');
                        const feel = document.getElementById('feels-like');
                        const min_temp = document.getElementById('min-temp');
                        const max_temp = document.getElementById('max-temp');
                        const details = document.getElementById('details');
                        const pressure = document.getElementById('pressure');
                        const humidity = document.getElementById('humidity');
                        const sea_lvl = document.getElementById('sea-lvl');
                        const gnd_lvl = document.getElementById('gnd-lvl');
                        const visibility = document.getElementById('visibility');
                        const w_speed = document.getElementById('w-speed');
                        const w_dir = document.getElementById('w-dir');
                        const w_gusts = document.getElementById('w-gusts');
                        const sunrise = document.getElementById('sunrise');
                        const sunset = document.getElementById('sunset');

                        loc.innerHTML = `${weather_data.name}, ${weather_data.sys.country}`;

                        let preciseTemp;
                        if(weather_data.main.temp < 10 && weather_data.main.temp > -10)
                            preciseTemp = weather_data.main.temp.toPrecision(2);
                        else
                            preciseTemp = weather_data.main.temp.toPrecision(3);
                        temp.innerHTML = `${preciseTemp} &deg;C`;

                        let preciseFeelTemp;
                        if(weather_data.main.feels_like < 10 && weather_data.main.feels_like > -10)
                            preciseFeelTemp = weather_data.main.feels_like.toPrecision(2);
                        else
                            preciseFeelTemp = weather_data.main.feels_like.toPrecision(3);
                        feel.innerHTML = `Feels: ${preciseFeelTemp} &deg;C`;

                        let preciseMinTemp;
                        if(weather_data.main.temp_min < 10 && weather_data.main.temp_min > -10)
                            preciseMinTemp = weather_data.main.temp_min.toPrecision(2);
                        else
                            preciseMinTemp = weather_data.main.temp_min.toPrecision(3);
                        min_temp.innerHTML = `Min: ${preciseMinTemp} &deg;C`;

                        let preciseMaxTemp;
                        if(weather_data.main.temp_max < 10 && weather_data.main.temp_max > -10)
                            preciseMaxTemp = weather_data.main.temp_max.toPrecision(2);
                        else
                            preciseMaxTemp = weather_data.main.temp_max.toPrecision(3);
                        max_temp.innerHTML = `Max: ${preciseMaxTemp} &deg;C`;

                        details.innerHTML = `${weather_data.weather[0].main} (${toTitleCase(weather_data.weather[0].description)})`;
                        pressure.innerHTML = `Pressure: ${weather_data.main.pressure} hPa`;
                        humidity.innerHTML = `Humidity: ${weather_data.main.humidity}%`;
                        sea_lvl.innerHTML = `Sea Level: ${weather_data.main.sea_level !== undefined ? weather_data.main.sea_level + ' hPa' : 'N/A'}`;
                        gnd_lvl.innerHTML = `Ground Level: ${weather_data.main.grnd_level !== undefined ? weather_data.main.grnd_level + ' hPa' : 'N/A'}`;
                        visibility.innerHTML = `Visibility: ${weather_data.visibility / 1000} km`;
                        w_speed.innerHTML = `Wind Speed: ${weather_data.wind.speed} m/s`;
                        w_dir.innerHTML = `Wind Direction: ${weather_data.wind.deg}&deg;`;
                        w_gusts.innerHTML = `Wind Gusts: ${weather_data.wind.gust !== undefined ? weather_data.wind.gust + ' m/s' : 'N/A'}`;

                        if(weather_data.sys.sunrise !== undefined){
                            const riseTime = new Date(weather_data.sys.sunrise);
                            const riseHours = riseTime.getHours() < 10 ? riseTime.getHours().toString().padStart(2, '0') : riseTime.getHours();
                            const riseMins = riseTime.getMinutes() < 10 ? riseTime.getMinutes().toString().padStart(2, '0') : riseTime.getMinutes();
                            sunrise.innerHTML = `Sunrise: ${riseHours}:${riseMins}`;
                        }else
                            sunrise.innerHTML = 'Sunrise: N/A';

                        if(weather_data.sys.sunset !== undefined){
                            const setTime = new Date(weather_data.sys.sunset);
                            const setHours = setTime.getHours() < 10 ? setTime.getHours().toString().padStart(2, '0') : setTime.getHours();
                            const setMins = setTime.getMinutes() < 10 ? setTime.getMinutes().toString().padStart(2, '0') : setTime.getMinutes();
                            sunset.innerHTML = `Sunset: ${setHours}:${setMins}`;
                        }else
                            sunset.innerHTML = 'Sunset: N/A';
                        
                        weatherPanel.style.display = 'block';
                    }else{
                        err_title.innerText = 'Server Response';
                        err_code.innerText = `${weather_data.cod}`;
                        err_desc.innerText = `${weather_data.message}`;
                        errorPanel.style.display = 'block';
                    }
                } catch (error) {
                    err_title.innerText = 'Unexpected Error';
                    err_code.innerText = '500';
                    err_desc.innerText = `${error}`;
                    errorPanel.style.display = 'block';
                }
            }else{
                err_title.innerText = 'Invalid Input';
                err_code.innerText = `404`;
                err_desc.innerText = `Please enter the name of a valid Indian city!`;
                errorPanel.style.display = 'block';
            }
        } catch (error) {
            err_title.innerText = 'Unexpected Error';
            err_code.innerText = '500';
            err_desc.innerText = `${error}`;
            errorPanel.style.display = 'block';
        }
    }
    document.getElementById('searchForm').reset();
    city.blur();
}

submitBtn.addEventListener('click', getWeather);