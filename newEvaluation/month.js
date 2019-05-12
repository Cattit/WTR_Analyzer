const dal = require("wtr-dal");

async function calculate(month, year) {

    let date_start = new Date(year, month - 1, 1);
    let date_end = new Date(year, month, 0);
    const masDSLM = await dal.getDepthSourceLocation();

    for (i = 0; i < masDSLM.length; i++) {
        let mark = 0;
        for (let curDate = date_start; curDate <= date_end; curDate.setDate(curDate.getDate() + 1), count++)
            mark = await dal.getRaitingAvgDaily(masDSLM[i].id_source, masDSLM[i].depth, date_start, masDSLM[i].id_location, date_end);
        await dal.saveRaiting(masDSL[i].id_source, mark, masDSL[i].depth, date_start, masDSL[i].id_location, date_end)
    }
}

calculate(4, 2019) // номер месяца, год