const cheerio = require("cheerio")
const https = require("https")

function getHtml() {
    let options = {
        hostname: 'www.tajmahalgbg.se',
        port: 443,
        path: "/lunch-meny/",
        method: "GET"
    }
    
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
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


    let relevantHtml = $(".elementor-widget-wrap h4, .elementor-widget-wrap p")

    let now = new Date()

    let menu = {
        restaurant: "Taj Mahal",
        year: now.getFullYear(),
        week: getWeek(now),
        days: {}
    }

    
    for (let day = 0; day < 5; day++) {
        let i = day * 12
        let dishes = []
        for (let dishIndex = 0; dishIndex < 5; dishIndex++) {
            try {
                let title = relevantHtml[i + dishIndex * 2].children[0].data.trim()
                let description = relevantHtml[i + dishIndex * 2 + 1].children[0].data.trim()

                dishes.push({
                    title: title,
                    description: description
                })
            } catch (e) {
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
