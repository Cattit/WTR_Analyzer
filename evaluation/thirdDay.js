const justify = 100,
    nojustify = 0,
    halfjustify = 50

function amountLiquidRainfall(markerRainfall, amount, i) {  // если осадков нет, первый параметр = 0, иначе = 1. третий параметр - номер строки (прогноз), при запросе от прогноза он равен -1. Возвращаем номер строки/столбца в массиве
    if (markerRainfall === 1) {
        if (amount >= 0 && amount < 3)
            return 1
        if (amount >= 3 && amount < 15)
            return 2
        if (i !== 5) {
            if (amount >= 15 && amount < 50)
                return 3
            if (amount >= 50)
                return 4
        }
        if (i === 5) {    // особый случай с допуском в 20%, см. наставление по оценке прогноозв погоды
            if (amount >= 15 && amount < 40)
                return 3
            if (amount >= 40)
                return 4
        }
    }

    return 0 // markerRainfall = 0
}

function amountSolidRainfall(markerRainfall, amount, i) {  // если осадков нет, первый параметр = 0, иначе = 1. третий параметр - номер строки (прогноз), при запросе от прогноза он равен -1. Возвращаем номер строки/столбца в массиве
    if (markerRainfall === 1) {
        if (amount >= 0 && amount < 2)
            return 1
        if (amount >= 2 && amount < 6)
            return 2
        if (i !== 5) {
            if (amount >= 6 && amount < 20)
                return 3
            if (amount >= 20)
                return 4
        }
        if (i === 5) {    // особый случай с допуском в 20%, см. наставление по оценке прогноозв погоды
            if (amount >= 6 && amount < 16)
                return 3
            if (amount >= 16)
                return 4
        }
    }

    return 0 // markerRainfall = 0
}

function weatherEvent(forecastEvent, realEvent) {
    let event = 0,
        count = 0
    for (let i = 0; i < forecastEvent.length; i++)
        if (forecastEvent[i] !== null) {
            if (forecastEvent[i] === realEvent[i])
                event += justify
            count++
        }
    return event / count
}

function calculate(forecast, real) {    // ПРОЦЕНТЫ
    let temperature // температура должна различаться не более, чем на 2 градуса
    if (Math.abs(forecast.temperature - real.temperature) <= 2)
        temperature = justify
    else temperature = nojustify

    let wind_speed  // скорость ветра должна отличаться от границ не более, чем на 2 м/с
    maxForecastWind = Math.max(forecast.wind_speed_to, forecast.wind_gust)
    maxRealtWind = Math.max(real.wind_speed_to, real.wind_gust)
    if (Math.abs(maxRealtWind - forecast.wind_speed_from) <= 2 || Math.abs(maxRealtWind - maxForecastWind) <= 2 || (maxRealtWind >= forecast.wind_speed_from && maxRealtWind <= maxForecastWind))
        wind_speed = justify
    else wind_speed = nojustify

    // явления погоды по факту наличия/отсутсвия
    let rainfall = weatherEvent([forecast.snow, forecast.rain, forecast.rainsnow, forecast.sand, forecast.squall, forecast.storm], [real.snow, real.rain, real.rainsnow, real.sand, real.squall, real.storm])


    // кол-во осадков
    const masRainfall = [
        [justify, halfjustify, nojustify, nojustify, nojustify],    // 100 50 0 0 0
        [halfjustify, justify, halfjustify, nojustify, nojustify],  // 50 100 50 0 0
        [nojustify, halfjustify, justify, halfjustify, nojustify],  // 0 50 100 50 0
        [nojustify, nojustify, halfjustify, justify, halfjustify],  // 0 0 50 100 50
        [nojustify, nojustify, nojustify, halfjustify, justify]     // 0 0 0 50 100
    ]
    let markerRainfallForecast = 1,
        markerRainfallReal = 1
    if (forecast.snow === 0 && forecast.rain === 0 && forecast.rainsnow === 0)   // без осадков
        markerRainfallForecast = 0
    if (real.snow === 0 && real.rain === 0 && real.rainsnow === 0)   // без осадков
        markerRainfallReal = 0

    const realAmountRainfall = (real.rainfall_from + real.rainfall_to) / 2
    let i, j    // i - строка (прогноз), j - столбец(факт)
    if (real.snow === 1 && real.rain === 0 && real.rainsnow === 0) {   // только твердые осадки
        i = amountSolidRainfall(markerRainfallForecast, forecast.amount_rainfall, -1)
        j = amountSolidRainfall(markerRainfallReal, realAmountRainfall, i)
    }
    else {   //смешанные осадки
        i = amountLiquidRainfall(markerRainfallForecast, forecast.amount_rainfall, -1)
        j = amountLiquidRainfall(markerRainfallReal, realAmountRainfall, i)
    }
    let amount_rainfall = masRainfall[i][j]

    // console.log(temperature, wind_speed, rainfall, amount_rainfall)
    // console.log((temperature + wind_speed + rainfall + amount_rainfall) / 4)
    // console.log(i, j)
    return (temperature + wind_speed + rainfall + amount_rainfall) / 4
}
module.exports.calculate = calculate