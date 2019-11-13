const { spawn } = require("child_process")

function update() {
    spawn("python", ["update_menus.py"])
}

update()

setInterval(update, 3600000)
