const evaluationfirstDay = require("./evaluation/firstDay.js");
const evaluationthirdDay = require("./evaluation/thirdDay.js");
const dal = require("wtr-dal");
const realWeatherForHours = require("./realWeatherForHours.js");
const date = new Date() //сегодня (сейчас)

async function getMark(source, id_location, depth_forecast) {
    const dateSomeDaysAgo = new Date(date.getFullYear(), date.getMonth(), date.getDate() - depth_forecast, 16, 0, 0, 000);  //день ??? часы  
    let id_forecast = await dal.getIdForecast(source, dateSomeDaysAgo); // прогноз взятый когда-то
    console.log(id_forecast)
    let markDay = []
    for (let i = 0, date_start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 000), date_end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
        i < 2; i++ , date_start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 000), date_end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59, 999)) { // сначала на день, потом на ночь        
        const dataForecast = await dal.getForecastData(id_forecast, id_location, date_start, date_end)
        const masRealWeather = await dal.getweatherForHours(id_location, date_start, date_end) // реальная погода
        const dataRealWeather = await realWeatherForHours.collectWeather(masRealWeather)  //упорядоченная реальная погода
        // console.log(dataRealWeather)
        if (depth_forecast === 1)
            markDay[i] = evaluationfirstDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ
        if (depth_forecast === 3)
            markDay[i] = evaluationthirdDay.calculate(dataForecast[0], dataRealWeather) // ПРОЦЕНТЫ

    }
    return ((markDay[0] + markDay[1]) / 2)
}

async function getDataFromDB(source, id_location) {
    // ПЕРВЫЙ ДЕНЬ    
    let depth_forecast = 1
    const markfirstDay = await getMark(source, id_location, depth_forecast)
    console.log(markfirstDay)
    await dal.saveRaiting(source, markfirstDay, depth_forecast, date, id_location)

    // ТРЕТИЙ ДЕНЬ
    depth_forecast = 3
    const markthirdDay = await getMark(source, id_location, depth_forecast)
    console.log(markthirdDay)
    await dal.saveRaiting(source, markthirdDay, depth_forecast, date, id_location)

    // ПЯТЫЙ ДЕНЬ
    // depth_forecast = 5
    // markfifthDay = getMark(source, id_location, depth_forecast)
    // // console.log(markfifthDay)
    // await dal.saveRaiting(source, markfifthDay, depth_forecast, date, id_location)
}
getDataFromDB("gismeteo", 10);    // yandex gismeteo