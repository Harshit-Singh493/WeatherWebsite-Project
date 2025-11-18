const log = console.log

navigator.geolocation.getCurrentPosition((pos) => {
  log(pos)
  const lat = pos.coords.latitude
  const long = pos.coords.longitude

  fetchUser(lat, long)

}, (err) => {
  alert(err, "Error Getting Location Please allow Location")
})


async function fetchUser(lat,long) {

  try {
    const apiData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto&hourly=apparent_temperature`)

    const aqiUser = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&hourly=us_aqi,pm10,pm2_5&timezone=auto`)
    //log(apiData)

    const aqiData = await aqiUser.json()
    const weathData = await apiData.json()
    log(weathData)
    log(aqiData)

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [weathData.daily.time[0], weathData.daily.time[1], weathData.daily.time[2], weathData.daily.time[3], weathData.daily.time[4], weathData.daily.time[5], weathData.daily.time[6]],
        datasets: [{
          label: '<- Max temp.',
          data: [weathData.daily.temperature_2m_max[0], weathData.daily.temperature_2m_max[1], weathData.daily.temperature_2m_max[2], weathData.daily.temperature_2m_max[3], weathData.daily.temperature_2m_max[4], weathData.daily.temperature_2m_max[5], weathData.daily.temperature_2m_max[6]],
          borderWidth: 1
        }, {
          label: '<- Min temp.',
          data: [weathData.daily.temperature_2m_min[0], weathData.daily.temperature_2m_min[1], weathData.daily.temperature_2m_min[2], weathData.daily.temperature_2m_min[3], weathData.daily.temperature_2m_min[4], weathData.daily.temperature_2m_min[5], weathData.daily.temperature_2m_min[6]],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    const weatherDescription = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      56: "Light Freezing Drizzle",
      57: "Dense Freezing Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      66: "Light Freezing Rain",
      67: "Heavy Freezing Rain",
      71: "Slight Snowfall",
      73: "Moderate Snowfall",
      75: "Heavy Snowfall",
      77: "Snow Grains",
      80: "Slight Rain Shower",
      81: "Moderate Rain Shower",
      82: "Violent Rain Shower",
      85: "Slight Snow Shower",
      86: "Heavy Snow Shower",
      95: "Thunderstorm",
      96: "Thunderstorm with Slight Hail",
      99: "Thunderstorm with Heavy Hail"
    }

    // const weatherCodeMap = {
    //   0: "Clear sky",
    //   1: "Mainly clear",
    //   2: "Partly cloudy",
    //   3: "Overcast",
    //   45: "Fog",
    //   48: "Depositing rime fog",
    //   51: "Light drizzle",
    //   53: "Moderate drizzle",
    //   55: "Dense drizzle",
    //   56: "Light freezing drizzle",
    //   57: "Dense freezing drizzle",
    //   61: "Slight rain",
    //   63: "Moderate rain",
    //   65: "Heavy rain",
    //   66: "Light freezing rain",
    //   67: "Heavy freezing rain",
    //   71: "Slight snow fall",
    //   73: "Moderate snow fall",
    //   75: "Heavy snow fall",
    //   77: "Snow grains",
    //   80: "Slight rain showers",
    //   81: "Moderate rain showers",
    //   82: "Violent rain showers",
    //   85: "Slight snow showers",
    //   86: "Heavy snow showers",
    //   95: "Thunderstorm",
    //   96: "Thunderstorm with slight hail",
    //   99: "Thunderstorm with heavy hail"
    // }
    const code = weathData.current_weather.weathercode
    const isDay = weathData.current_weather.is_day
    const desc = weatherDescription[code]
    
    document.getElementById('weatherConditon').innerHTML = desc

    function getIcon(code, isDay) {
      if (code == 0 && isDay == 1) {
        return 'icons/Weather/clear-day.svg'
      } else if (code == 0 && isDay == 0) {
        return 'icons/Weather/clear-night.svg'
      } else if (code == 1 && isDay == 1) {
        return 'icons/Weather/partly-cloudy-day.svg'
      } else if (code == 1 && isDay == 0) {
        return 'icons/Weather/partly-cloudy-night.svg'
      } else if (code == 2 && isDay == 1) {
        return 'icons/Weather/partly-cloudy-day.svg'
      } else if (code == 2 && isDay == 0) {
        return 'icons/Weather/partly-cloudy-night.svg'
      } else if (code == 3 && (isDay == 1 || isDay == 0)) {
        return 'icons/Weather/cloudy.svg'
      } else if ((code == 45 || code == 48) && isDay == 1) {
        return 'icons/Weather/fog-day.svg'
      } else if ((code == 45 || code == 48) && isDay == 0) {
        return 'icons/Weather/fog-night.svg'
      } else if ((code == 51 || code == 53 || code == 55) && isDay == 1) {
        return 'icons/Weather/partly-cloudy-day-drizzle.svg'
      } else if ((code == 51 || code == 53 || code == 55) && isDay == 0) {
        return 'icons/Weather/partly-cloudy-night-drizzle.svg'
      } else if ((code == 56 || code == 57) && isDay == 1) {
        return 'icons/Weather/partly-cloudy-day-drizzle.svg'
      } else if ((code == 56 || code == 57) && isDay == 0) {
        return 'icons/Weather/partly-cloudy-night-drizzle.svg'
      } else if ((code == 61 || code == 63 || code == 65)) {
        return 'icons/Weather/rain.svg'
      } else if ((code == 66 || code == 67)) {
        return 'icons/Weather/rain.svg'
      } else if ((code == 80 || code == 81 || code == 82)) {
        return 'icons/Weather/rain.svg'
      } else if ((code == 71 || code == 73 || code == 75 || code == 77)) {
        return 'icons/Weather/snow.svg'
      } else if ((code == 85 || code == 86)) {
        return 'icons/Weather/snow.svg'
      } else if ((code == 95 || code == 96 || code == 99) && isDay == 1) {
        return 'icons/Weather/thunderstorms-day.svg'
      } else if ((code == 95 || code == 96 || code == 99) && isDay == 0) {
        return 'icons/Weather/thunderstorms-night.svg'
      }
    }
    //document.getElementById('icon').classList.remove('hidden')
    document.getElementById('icon').src = getIcon(code, isDay) 
    document.getElementById('currentTemp').innerHTML = weathData.current_weather.temperature
     
    document.getElementById('loader').remove()
  } catch (error) {
    
    log(error)
  }
  
}
