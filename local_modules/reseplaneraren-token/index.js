const https = require("https")

exports.get = (auth, deviceId) => {
    let options = {
        hostname: 'api.vasttrafik.se',
        port: 443,
        path: "/token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + auth
        }
    }
    
    let body = "grant_type=client_credentials" + (deviceId ? `&scope=${deviceId}` : "")

    // TODO: reject
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
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

exports.getNew = (auth) => {
    let deviceId = "device_" + new Date().getTime()
    return exports.get(auth, deviceId)
}


/*
// For the browser:
fetch("https://api.vasttrafik.se/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic <key>"
    },
    body: "grant_type=client_credentials"
}).then(res => {
    res.text().then(text => console.log(JSON.parse(text)))
})
*/