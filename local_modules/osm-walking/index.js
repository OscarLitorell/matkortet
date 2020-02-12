const https = require("https")

exports.trip = (origin, destination) => {
    let options = {
        hostname: "routing.openstreetmap.de",
        port: 443,
        path: `/routed-foot/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
        method: "GET"
    }

    return new Promise((resolve, reject) => {
        let req = https.request(options, res => {
            let data = ""
            res.on("data", d => data += d)
            res.on("error", (error) => reject(error))
            res.on("end", () => {
                resolve(JSON.parse(data))
            })
        })
        req.end()
    })
}
