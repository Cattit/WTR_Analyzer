const justify = 100,
    justify75 = 75,
    halfjustify = 50,
    nojustify = 0
let globalCount = 0

function amountLiquidRainfall(markerRainfall, amount, i) {  // если осадков нет, первый параметр = 0, иначе = 1. третий параметр - номер строки (прогноз), при запросе от прогноза он равен -1. Возвращаем номер строки/столбца в массиве
    if (markerRainfall === 1) {
        if (amount >= 0 && amount < 0.3)
            return 1
        if (amount >= 0.3 && amount < 4)
            return 2
        if (amount >= 4 && amount < 15)
            return 3
        if (i !== 5) {
            if (amount >= 15 && amount < 50)
                return 4
            if (amount >= 50)
                return 5
        }
        if (i === 5) {   // особый случай с допуском в 20%, см. наставление по оценке прогнозов погоды
            if (amount >= 15 && amount < 40)
                return 4
            if (amount >= 40)
                return 5
        }
    }

    return 0 // markerRainfall = 0
}

function amountSolidRainfall(markerRainfall, amount, i) {  // если осадков нет, первый параметр = 0, иначе = 1. третий параметр - номер строки (прогноз), при запросе от прогноза он равен -1. Возвращаем номер строки/столбца в массиве
    if (markerRainfall === 1) {
        if (amount >= 0 && amount < 0.2)
            return 1
        if (amount >= 0.2 && amount < 3)
            return 2
        if (amount >= 3 && amount < 7)
            return 3
        if (i !== 5) {
            if (amount >= 7 && amount < 20)
                return 4
            if (amount >= 20)
                return 5
        }
        if (i === 5) {    // особый случай с допуском в 20%, см. наставление по оценке прогнозов погоды
            if (amount >= 7 && amount < 16)
                return 4
            if (amount >= 16)
                return 5
        }
    }

    return 0 // markerRainfall = 0
}

function weatherEvent(forecastEvent, realEvent) {
    let event = 0,
        count = 0
    for (let i = 0; i < forecastEvent.length; i++)
        if (forecastEvent[i] !== null && !(forecastEvent[i] === 0 && realEvent[i] === 0)) {
            if (forecastEvent[i] === realEvent[i])
                event += justify
            count++
        }

    if (count) {
        globalCount++
        return event / count
    }
    else return 0
}

function windSpeed(Fwind_speed_from, Fwind_speed_to, Fwind_gust, Rwind_speed_to, Rwind_gust) {
    maxForecastWind = Math.max(Fwind_speed_to, Fwind_gust)
    maxRealtWind = Math.max(Rwind_speed_to, Rwind_gust)
    if (maxRealtWind >= 15) {  // меньше 15 мс ветер не оценивается
        if (maxForecastWind >= 15 && (Math.abs(maxRealtWind - Fwind_speed_from) <= 2 || Math.abs(maxRealtWind - maxForecastWind) <= 2 || (maxRealtWind >= Fwind_speed_from && maxRealtWind <= maxForecastWind)))
            return justify
        else {
            globalCount++
            return nojustify
        }
    }
    else return 0
}

function calculate(forecast, real) {    // ПРОЦЕНТЫ    
    globalCount = 0
    let temperature = 0 // температура должна различаться не более, чем на 2 градуса
    if (Math.abs(forecast.temperature - real.temperature) <= 2)
        temperature = justify
    else temperature = nojustify
    globalCount++

    // скорость ветра должна отличаться от границ не более, чем на 2 м/с
    let wind_speed = windSpeed(forecast.wind_speed_from, forecast.wind_speed_to, forecast.wind_gust, real.wind_speed_to, real.wind_gust)

    // кол-во осадков
    const masRainfall = [
        [justify, justify75, halfjustify, nojustify, nojustify, nojustify],         // 100 75 50 0 0 0
        [justify, justify, justify75, nojustify, nojustify, nojustify],             // 100 100 75 0 0 0
        [halfjustify, justify, justify, halfjustify, nojustify, nojustify],         // 50 100 100 50 0 0
        [nojustify, nojustify, halfjustify, justify, halfjustify, nojustify],       // 0 0 50 100 50 0
        [nojustify, nojustify, nojustify, halfjustify, justify, nojustify],         // 0 0 0 50 100 0
        [nojustify, nojustify, nojustify, nojustify, nojustify, justify]            // 0 0 0 0 0 100
    ]
    let markerRainfallForecast = 1,
        markerRainfallReal = 1
    if (forecast.snow === 0 && forecast.rain === 0 && forecast.rainsnow === 0)   // без осадков
        markerRainfallForecast = 0
    if (real.snow === 0 && real.rain === 0 && real.rainsnow === 0)   // без осадков
        markerRainfallReal = 0

    let i, j    // i - строка (прогноз), j - столбец(факт)
    if ((real.snow === 1 && real.rain === 0 && real.rainsnow === 0) || (real.snow === 0 && real.rain === 0 && real.rainsnow === 0 && forecast.snow === 1 && forecast.rain === 0 && forecast.rainsnow === 0)) {   // только твердые осадки
        i = amountSolidRainfall(markerRainfallForecast, forecast.amount_rainfall, -1)
        j = amountSolidRainfall(markerRainfallReal, real.rainfall, i)
    }
    else {   //смешанные осадки
        i = amountLiquidRainfall(markerRainfallForecast, forecast.amount_rainfall, -1)
        j = amountLiquidRainfall(markerRainfallReal, real.rainfall, i)
    }
    let amount_rainfall = masRainfall[i][j]
    globalCount++

    // явления погоды по факту наличия/отсутсвия
    if (j === 4 || j === 5) real.hard_rainfall = 1
    let rainfall = weatherEvent([forecast.snow, forecast.rain, forecast.rainsnow, forecast.mist, forecast.sand, forecast.hard_wind, forecast.hard_heat, forecast.hard_frost, forecast.hard_rainfall], [real.snow, real.rain, real.rainsnow, real.mist, real.sand, real.hard_wind, real.hard_heat, real.hard_frost, real.hard_rainfall])

    // console.log(temperature, wind_speed, rainfall, amount_rainfall, globalCount)
    // console.log(i, j)
    // console.log((temperature + wind_speed + rainfall + amount_rainfall) / globalCount)

    return (temperature + wind_speed + rainfall + amount_rainfall) / globalCount
}
module.exports.calculate = calculate