
const sqlite3 = require("sqlite3").verbose()
const Reseplaneraren = require('reseplaneraren')
const Token = require("reseplaneraren-token")
const osm = require("osm-walking")

let auth = process.env.VASTTRAFIK_KEY

let db = new sqlite3.Database("restaurants.db")

module.exports.attachRoutes = (router) => {
    router.get("/api/:obj", (req, res, next) => {
        let obj = req.params.obj

        let handler = api[obj]

        if (handler) {
            handler(req, res)
        } else {
            res.status(401)
            res.send("Bad request")
        }
    })
}

const api = {
    "restaurants": async (req, res) => {
        db.all("SELECT * FROM restaurants", (err, rows) => {
            res.json(rows)
        })
    },

    "journey": async (req, res) => {

        let options = {
            destinationId: req.query.destinationId,
            startTime: req.query.startTime,
            endTime: req.query.endTime
        }

        if (Object.values(options).includes(undefined)) {
            res.status(401)
            res.send("Bad request")
        }

        let result = await allPromiseValues({
            origin: Restaurant.get(23),
            destination: Restaurant.get(options.destinationId),
            token: Token.get(auth)
        })
        
        let origin = result.origin
        let destination = result.destination
        let token = result.token

        Reseplaneraren.setToken(token)

        let trips = await allPromiseValues({
            transitThere: getTransitTrip(origin, destination, options.startTime),
            transitBack: getTransitTrip(destination, origin, options.endTime, 1),
            walk: osm.trip(origin, destination)
        })

        let bestTrips = Trip.bestTrips(trips, options.startTime, options.endTime, origin, destination)

        res.json(bestTrips)
    }
}

/**
 * Like Promise.all(iterable), but instead of the iterable being an array, it is an object.
 * It returns a promise that is resolved when all the promises in the passed object are resolved.
 * @param {object} obj
 * @returns {promise}
 */
function allPromiseValues(obj) {
    let results = {}

    Object.keys(obj).forEach(key => {
        obj[key].then(res => results[key] = res)
    })

    return new Promise((resolve, reject) => {
        Promise.allSettled(Object.values(obj)).then(() => resolve(results))
    })
}

class Restaurant {
    constructor(obj) {
        Object.assign(this, obj)
    }
    
    /**
     * Get a restaurant with a specific id
     * @param {number} id 
     * @returns {promise}
     */
    static get(id) {
        return new Promise((resolve) => {
            db.get(`SELECT * FROM restaurants WHERE id = ?`, id, (err, row) => {
                if (!row) resolve(null)
                let restaurant = new Restaurant(row)
                resolve(restaurant)
            })
        })
    }
}

class Trip {
    constructor(legs) {
        this.legs = legs
    }

    static walk(obj, originName, destinationName, time, timeAtArrival=false) {
        let duration
        
        try {
            duration = obj.routes[0].duration
        } catch (error) {
            return null
        }

        let legs = [{
            Origin: {
                name: originName,
                time: timeAtArrival ? timeDelta(time, -duration) : time
            },
            Destination: {
                name: destinationName,
                time: timeAtArrival ? time : timeDelta(time, duration)
            },
            name: "Gå",
            type: "WALK"
        }]

        return new Trip(legs)
    }

    static transit(rawTransitTrip, last=false) {
        let legs
        try {
            let index = last ? rawTransitTrip.TripList.Trip.length - 1 : 0
            legs = rawTransitTrip.TripList.Trip[index].Leg

            legs = legs.filter(leg => leg.Origin.name !== leg.Destination.name)

        } catch (error) {
            return null
        }
        return new Trip(legs)
    }

    static bestTrips(rawTrips, startTime, endTime, origin, destination) {
        let transitThere = Trip.transit(rawTrips.transitThere)
        let transitBack = Trip.transit(rawTrips.transitBack, true)
        let walkThere = Trip.walk(rawTrips.walk, origin.name, destination.name, startTime)
        let walkBack = Trip.walk(rawTrips.walk, destination.name, origin.name, endTime, true)

        let journey = {}


        if (transitThere && before(transitThere.destination.time, walkThere.destination.time)) {
            journey.tripThere = transitThere
        } else {
            journey.tripThere = walkThere
        }
        if (transitBack && !before(transitBack.origin.time, walkBack.origin.time)) {
            journey.tripBack = transitBack
        } else {
            journey.tripBack = walkBack
        }

        return journey
    }

    get legCount() {
        return this.legs.length
    }

    get tripSpan() {
        return [this.origin.time, this.destination.time]
    }

    get origin() {
        return this.legs[0].Origin
    }

    get destination() {
        return this.legs[this.legCount - 1].Destination
    }
}

/**
 * Is time1 before time2?
 * @param {string} time1 "HH:MM" 
 * @param {string} time2 "HH:MM"
 * @returns {boolean}
 */
function before(time1, time2) {
    return new Date("2000-01-01 " + time1) < new Date("2000-01-01 " + time2)
}

/**
 * 
 * @param {string} time 
 * @param {*} seconds 
 */
function timeDelta(time, seconds) {
    let out = new Date(new Date("2000-01-01 " + time).getTime() + seconds * 1000)
    return getTime(out)
}

/**
 * Get the time as a string.
 * @param {date} date 
 * @returns {string} "HH:MM"
 */
function getTime(date) {
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0')

}

function getTransitTrip(origin, destination, time, searchForArrival=0) {
    return new Promise((resolve, reject) => {
        let options = {
            originCoordName: origin.name,
            originCoordLat: origin.latitude,
            originCoordLong: origin.longitude,
            destCoordName: destination.name,
            destCoordLat: destination.latitude,
            destCoordLong: destination.longitude,
            time: time,
            searchForArrival, searchForArrival
        }

        let tripApi = new Reseplaneraren.TripApi()

        tripApi.getTrip(options, (error, data, response) => {
            if (error) {
                reject()
                return
            }
            resolve(response.body)
        })
    })
}
