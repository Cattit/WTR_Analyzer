const evaluationfirstDay = require("./newEvaluation/firstDay.js");
const evaluationthirdDay = require("./newEvaluation/thirdDay.js");
const evaluationfifthDay = require("./newEvaluation/fifthDay.js")
const dal = require("wtr-dal");
const realWeatherForHours = require("./realWeatherForHours.js");
const date = new Date() //сегодня (сейчас)

async function getMark(source, id_location, depth_forecast) {
    const yesterday = date.getDate() - 1
    const dateSomeDaysAgo = new Date(date.getFullYear(), date.getMonth(), yesterday - depth_forecast);  //день 
    let id_forecast = await dal.getIdForecast(source, dateSomeDaysAgo); // прогноз взятый когда-то
    console.log(id_forecast)
    let markDay = []
    for (let i = 0, date_start = new Date(date.getFullYear(), date.getMonth(), yesterday, 12, 0, 0, 000), date_end = new Date(date.getFullYear(), date.getMonth(), yesterday, 23, 59, 59, 999);
        i < 2; i++ , date_start = new Date(date.getFullYear(), date.getMonth(), yesterday, 0, 0, 0, 000), date_end = new Date(date.getFullYear(), date.getMonth(), yesterday, 11, 59, 59, 999)) { // сначала на день, потом на ночь        
        const dataForecast = await dal.getForecastData(id_forecast, id_location, date_start, date_end)
        const masRealWeather = await dal.getweatherForHours(id_location, date_start, date_end) // реальная погода
        const dataRealWeather = await realWeatherForHours.collectWeather(masRealWeather)  //упорядоченная реальная погода
        // console.log(dataRealWeather)
        if (depth_forecast === 1)
            markDay[i] = evaluationfirstDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 3)
            markDay[i] = evaluationthirdDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 5)
            markDay[i] = evaluationfifthDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ

    }
    return ((markDay[0] + markDay[1]) / 2)
}

async function getDataFromDB(source, id_location, depth_forecast) {
    const markDay = await getMark(source, id_location, depth_forecast)
    console.log(markDay)
    await dal.saveRaiting(source, markDay, depth_forecast, date, id_location)
}

getDataFromDB("AccuWeather", 1, 3);    // yandex gismeteo AccuWeather