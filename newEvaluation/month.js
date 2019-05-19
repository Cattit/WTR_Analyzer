const dal = require("wtr-dal");

async function calculate(month, year) {

    let date_start = new Date(year, month - 1, 1);
    let date_end = new Date(year, month, 0);
    const masDSL = await dal.getDepthSourceLocation();

    for (let i = 0; i < masDSL.length; i++) {
        let mark = 0;
        mark = await dal.getRaitingAvgDaily(masDSL[i].id_source, masDSL[i].depth, date_start, masDSL[i].id_location, date_end);
        await dal.saveRaiting(masDSL[i].id_source, mark, masDSL[i].depth, date_start, masDSL[i].id_location, date_end)
	//console.log(mark, masDSL[i].depth, masDSL[i].id_source, masDSL[i].id_location)
    }
}

calculate(4, 2019) // номер месяца, год