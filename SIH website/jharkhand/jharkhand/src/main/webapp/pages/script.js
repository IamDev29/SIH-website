const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
const url = 'https://api.openweathermap.org/data/2.5/weather';

$(document).ready(function () {
    weatherFn('Jharkhand');

    $('#city-input-btn').on('click', function () {
        let cityName = $('#city-input').val();
        if (cityName) {
            weatherFn(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });
});

async function weatherFn(city) {
    try {
        const response = await fetch(`${url}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (response.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (err) {
        console.error('Error fetching weather:', err);
        alert('Error fetching weather. Please try later.');
    }
}

function weatherShowFn(data) {
    const temp = Math.round(data.main.temp);
    const wind = data.wind.speed;

    $('#city-name').text(`${data.name}, ${data.sys.country}`);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${wind} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();

    $('.weather-card').removeClass('danger-card');
    $('#temperature, #wind-speed').removeClass('danger-alert');

    if (temp >= 40) {
        $('#temperature')
            .css({ color: '#E53935', 'font-weight': 'bold' })
            .append(' <i class="fas fa-exclamation-triangle" style="color:#E53935;"></i>');
        $('#temperature').addClass('danger-alert');
        $('.weather-card').addClass('danger-card');
    } else if (temp <= 5) {
        $('#temperature')
            .css({ color: '#1565C0', 'font-weight': 'bold' })
            .append(' <i class="fas fa-icicles" style="color:#1565C0;"></i>');
        $('#temperature').addClass('danger-alert');
        $('.weather-card').addClass('danger-card');
    } else {
        $('#temperature').css({ color: '#1565C0' });
    }

    if (wind >= 15) {
        $('#wind-speed')
            .css({ color: '#E53935', 'font-weight': 'bold' })
            .append(' <i class="fas fa-wind" style="color:#E53935;"></i> <b>Dangerously Windy!</b>');
        $('#wind-speed').addClass('danger-alert');
        $('.weather-card').addClass('danger-card');
    } else {
        $('#wind-speed').css({ color: '#FF5252' });
    }
}