const evaluationfirstDay = require("./newEvaluation/firstDay.js");
const evaluationthirdDay = require("./newEvaluation/thirdDay.js");
const evaluationfifthDay = require("./newEvaluation/fifthDay.js")
const dal = require("wtr-dal");
const realWeatherForHours = require("./realWeatherForHours.js");
const date = new Date() //сегодня (сейчас)
const yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0, 0, 000)

async function getMark(id_source, id_location, depth_forecast) {
    const dateSomeDaysAgo = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - depth_forecast);  //день 
    let markDay = []
    for (let i = 0, date_start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0, 0, 000), date_end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        i < 2; i++ , date_start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 000), date_end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 11, 59, 59, 999)) { // сначала на день, потом на ночь        
        const dataForecast = await dal.getForecastDataLeftJoin(id_source, dateSomeDaysAgo, id_location, date_start, date_end)
        const masRealWeather = await dal.getweatherForHours(id_location, date_start, date_end) // реальная погода
        const dataRealWeather = await realWeatherForHours.collectWeather(masRealWeather)  //упорядоченная реальная погода
        if (depth_forecast === 1)
            markDay[i] = evaluationfirstDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 3)
            markDay[i] = evaluationthirdDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 5)
            markDay[i] = evaluationfifthDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
    }
    return ((markDay[0] + markDay[1]) / 2)
}

async function getDataFromDB() {
    const masDSL = await dal.getDepthSourceLocation() //DepthSourceLocation  
    for (let i = 0; i < masDSL.length; i++) {
        let markDay = await getMark(masDSL[i].id_source, masDSL[i].id_location, masDSL[i].depth)
        await dal.saveRaiting(masDSL[i].id_source, markDay, masDSL[i].depth, yesterday, masDSL[i].id_location, yesterday)
    }
}

getDataFromDB();    
