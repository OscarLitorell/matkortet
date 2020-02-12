const cheerio = require("cheerio")
const http = require("http")

function getHtml() {
    let options = {
        hostname: 'seaside.kvartersmenyn.se',
        port: 80,
        method: "GET"
    }
    
    return new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let data = ""
            res.on("data", d => data += d)
            res.on("end", () => {
                resolve(data)
            })
        })
        
        req.end()
    })
}

module.exports = async () => {
    let html = await getHtml()
    const $ = cheerio.load(html)


    let relevantHtml = $(".meny")[0].children

    let now = new Date()

    let menu = {
        restaurant: "Restaurang Seaside",
        year: now.getFullYear(),
        week: getWeek(now),
        days: {}
    }

    for (let day = 0; day < 5; day++) {
        let i = day * 11 + 2
        let dishes = []
        
        for (let dishIndex = 0; dishIndex < 4; dishIndex++) {
            try {
                let dish = relevantHtml[i + dishIndex * 2].data.trim()
                if (dish && dish !== "") {
                    let dishArray = dish.split(" ")

                    dishes.push({
                        title: dishArray[0],
                        description: dishArray.slice(1).join(" ")
                    })
                }
            } catch (e){
                // Do nothing
            }
        }

        menu.days[day] = dishes
    }
    return menu
}

function getWeek(date) {
    var year = date.getFullYear();
    var oneJan = new Date("Jan 1 " + year);
    var oneJanDay = (oneJan.getDay() + 6) % 6 
    var day = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
    var week = Math.floor(day / 7);

    if (oneJanDay < 4) {
        week++;
    }
    return week;
}
