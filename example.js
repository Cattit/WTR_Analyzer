const evaluationfirstDay = require("./newEvaluation/firstDay.js");
const evaluationthirdDay = require("./newEvaluation/thirdDay.js");
const evaluationfifthDay = require("./newEvaluation/fifthDay.js")
const dal = require("wtr-dal");
const realWeatherForHours = require("./realWeatherForHours.js");
// const date = new Date() //сегодня (сейчас)
// const yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0, 0, 000)

async function getMark(id_source, id_location, depth_forecast, data_startWithoutTime) {
    const data_forecast = new Date(data_startWithoutTime.getFullYear(), data_startWithoutTime.getMonth(), data_startWithoutTime.getDate() - depth_forecast);  //день, когда сделан прогноз
    let markDay = []
    for (let i = 0, date_start = new Date(data_startWithoutTime.getFullYear(), data_startWithoutTime.getMonth(), data_startWithoutTime.getDate(), 12, 0, 0, 000), date_end = new Date(data_startWithoutTime.getFullYear(), data_startWithoutTime.getMonth(), data_startWithoutTime.getDate(), 23, 59, 59, 999);
        i < 2; i++ , date_start = new Date(data_startWithoutTime.getFullYear(), data_startWithoutTime.getMonth(), data_startWithoutTime.getDate(), 0, 0, 0, 000), date_end = new Date(data_startWithoutTime.getFullYear(), data_startWithoutTime.getMonth(), data_startWithoutTime.getDate(), 11, 59, 59, 999)) { // сначала на день, потом на ночь        
        const dataForecast = await dal.getForecastDataLeftJoin(id_source, data_forecast, id_location, date_start, date_end)
        const masRealWeather = await dal.getweatherForHours(id_location, date_start, date_end) // реальная погода
        const dataRealWeather = await realWeatherForHours.collectWeather(masRealWeather)  //упорядоченная реальная погода
        if (depth_forecast === 1)
            markDay[i] = evaluationfirstDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 3)
            markDay[i] = evaluationthirdDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 5)
            markDay[i] = evaluationfifthDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        console.log(data_forecast, date_start, date_end)
    }
    return ((markDay[0] + markDay[1]) / 2)
}

async function getDataFromDB() {
    let markDay = await getMark(1, 22, 3, new Date(2019, 5, 8)) // русурс, город, глубина, дата на какое прогноз
    //await dal.saveRaiting(masDSL[i].id_source, markDay, masDSL[i].depth, yesterday, masDSL[i].id_location, yesterday)
    console.log(markDay)
}

getDataFromDB();    
