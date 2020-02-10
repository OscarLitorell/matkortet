var Reseplaneraren = require('reseplaneraren')
const Token = require("./token.js")

// Set OAuth token
Token.get().then(token => {
    Reseplaneraren.setToken(token)


    let apiInstance = new Reseplaneraren.LocationApi();

    let callback = (error, data, response) => {
        if (error) {
            console.error(error)
        } else {
            let data = JSON.parse(response.text)
            console.log('API called successfully. Returned data: ' + response.text)
        }
    }
    apiInstance.getNearbyStops(57.69048, 11.97453, {}, callback);
})