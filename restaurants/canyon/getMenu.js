const cheerio = require("cheerio")
const http = require("http")

function getHtml() {
    let options = {
        hostname: 'restaurang-einstein.se',
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

    let relevantHtml = $(".content-wrapper")[3].children

    let now = new Date()

    let menu = {
        restaurant: "Café Canyon",
        year: now.getFullYear(),
        week: getWeek(now),
        days: {}
    }

    for (let day = 0; day < 5; day++) {
        let i = day * 4 + 3

        let dishes = []

        try {
            let htmlDishes = relevantHtml[i].children[1].children[0].children
            htmlDishes.forEach(htmlDish => {
                let dish
                try {
                    dish = htmlDish.children[0].data
                } catch (e) {
                    return
                }

                if (!dish) return

                dish = dish.trim()
                if (dish === "") return

                dishes.push({
                    title: "",
                    description: dish
                })
            })
        } catch (e) {
            // Do nothing
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