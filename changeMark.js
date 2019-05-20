const evaluationfirstDay = require("./newEvaluation/firstDay.js");
const evaluationthirdDay = require("./newEvaluation/thirdDay.js");
const evaluationfifthDay = require("./newEvaluation/fifthDay.js")
const dal = require("wtr-dal");
const realWeatherForHours = require("./realWeatherForHours.js");

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
    }
    return ((markDay[0] + markDay[1]) / 2)
}

async function getDataFromDB() {
    let date_forecast = new Date(2019, 4, 16)
    let id_location = 22
    let markDay = []
    markDay[0] = new Object()
    markDay[0].id_source = 1
    markDay[0].depth = 3
    markDay[1] = new Object()
    markDay[1].id_source = 1
    markDay[1].depth = 5
//    markDay[2] = new Object()
//    markDay[2].id_source = 0
//    markDay[2].depth = 1
//    markDay[3] = new Object()
//    markDay[3].id_source = 0
//    markDay[3].depth = 1
//    markDay[4] = new Object()
//    markDay[4].id_source = 1
//    markDay[4].depth = 3
//    markDay[5] = new Object()
//    markDay[5].id_source = 1
//    markDay[5].depth = 1
    
    for (let i = 0; i<markDay.length; i++){
	markDay[i].mark = await getMark(markDay[i].id_source, id_location, markDay[i].depth, date_forecast)
	await dal.changeRaiting(markDay[i].id_source, markDay[i].mark, markDay[i].depth, date_forecast, id_location, date_forecast)
	//console.log("Оценка:")
	console.log(markDay[i].mark)
    }
}

getDataFromDB();
