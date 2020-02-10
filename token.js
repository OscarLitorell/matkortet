
const https = require("https")
const fs = require("fs")


exports.get = (deviceId) => {
    let options = {
        hostname: 'api.vasttrafik.se',
        port: 443,
        path: "/token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + fs.readFileSync("västtrafik-auth.txt", "utf-8")
        }
    }
    
    let body = "grant_type=client_credentials" + (deviceId ? `&scope=${deviceId}` : "")

    // TODO: reject
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = ""
            res.on("data", d => data += d)
            res.on("end", () => {
                resolve(JSON.parse(data).access_token)
            })
        })
        
        req.write(body)
        req.end()
    })
}

exports.getNew = () => {
    let deviceId = "device_" + new Date().getTime()
    return exports.get(deviceId)
}


/*
// For the browser:
fetch("https://api.vasttrafik.se/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic eHRzVU9SbUtpM05uWF9SZEptOG9EZmtud1ZBYTpGZ21qejI3M2N2RVFWVFhEZEg4M1dSa0xlV0Fh"
    },
    body: "grant_type=client_credentials"
}).then(res => {
    res.text().then(text => console.log(JSON.parse(text)))
})
*/