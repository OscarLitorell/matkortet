const Reseplaneraren = require('reseplaneraren')
const Token = require("reseplaneraren-token")
const fs = require("fs")

// Set OAuth token
let auth = fs.readFileSync("västtrafik-auth.txt", "utf-8")
Token.get(auth).then(token => {
    Reseplaneraren.setToken(token)

    let apiInstance = new Reseplaneraren.LocationApi();

    let callback = (error, data, response) => {
        if (error) {
            console.error(error)
        } else {
            console.log('API called successfully. Returned data: ' + response.text)
        }
    }
    apiInstance.getNearbyStops(57.69048, 11.97453, {}, callback);
})