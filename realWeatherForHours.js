let dal = require("wtr-dal");

function type_day(mas) {
    return (mas.type_day === "day")
}

function hard_rainfall() {

}

function collectWeather(dataAll) {
    let rainfall_from = dataAll.map(d => d.rainfall_from).reduce((a, b) => a + b),
        rainfall_to = dataAll.map(d => d.rainfall_to).reduce((a, b) => a + b),
        rainfall = (rainfall_from + rainfall_to) / 2     // !!! изменить
    return {
        temperature: type_day(dataAll[0]) ? Math.max(...dataAll.map(d => d.temperature), dataAll[0].temperature) : Math.min(...dataAll.map(d => d.temperature), dataAll[0].temperature), // находим минимальную температуру ночью, максимальную днем
        wind_speed_from: Math.min(...dataAll.map(d => d.wind_speed_from), dataAll[0].wind_speed_from),   // минимум ветра
        wind_speed_to: Math.max(...dataAll.map(d => d.wind_speed_to), dataAll[0].wind_speed_to),   // максимум ветра
        wind_gust: Math.max(...dataAll.map(d => d.wind_gust), dataAll[0].wind_gust),   // маскимальные порывы ветра
        rainfall: rainfall,  // количество осадков
        snow: Math.max(...dataAll.map(d => d.snow), dataAll[0].snow), // вид осадков: 0 - нет, 1 - есть
        rain: Math.max(...dataAll.map(d => d.rain), dataAll[0].rain),
        rainsnow: Math.max(...dataAll.map(d => d.rainsnow), dataAll[0].rainsnow),
        mist: Math.max(...dataAll.map(d => d.mist), dataAll[0].mist),
        sand: Math.max(...dataAll.map(d => d.sand), dataAll[0].sand),
        squall: Math.max(...dataAll.map(d => d.squall), dataAll[0].squall),
        storm: Math.max(...dataAll.map(d => d.storm), dataAll[0].storm),
        drizzle: Math.max(...dataAll.map(d => d.drizzle), dataAll[0].drizzle),
        hard_wind: Math.max(...dataAll.map(d => d.hard_wind), dataAll[0].hard_wind),
        hard_heat: Math.max(...dataAll.map(d => d.hard_heat), dataAll[0].hard_heat),
        hard_frost: Math.max(...dataAll.map(d => d.hard_frost), dataAll[0].hard_frost),
        hard_rainfall: 0
    }
}
module.exports.collectWeather = collectWeather;