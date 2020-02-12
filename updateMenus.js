
const fs = require("fs")
const glob = require("glob")


function update() {
    glob("restaurants/*", (err, dirs) => {

        let menus = []

        dirs.forEach(dir => {
            let menuGetter = require("./" + dir + "/getMenu.js")
            menus.push(menuGetter())
        })

        Promise.all(menus).then(values => {
            fs.writeFile("./public/menus.json", JSON.stringify(values), () => {})
        })
    })
}


update()

setInterval(update, 3600000)

