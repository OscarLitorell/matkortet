
class Journey {
    constructor(obj) {
        this.tripThere = new Trip(obj.tripThere.legs)
        this.tripBack = new Trip(obj.tripBack.legs)
    }

    get timeToEat() {
        return (new Date("2000-01-01 " + this.tripBack.origin.time).getTime() - new Date("2000-01-01 " + this.tripThere.destination.time).getTime()) / 60000
    }
}

class Trip {
    constructor(legs) {
        this.legs = legs
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

    createHtml() {

        let root = elem("div", "trip")
        this.legs.forEach((leg, index) => {
            let stopHtml = createStopHtml(leg.Origin, index === 0)
            let legHtml = createLegHtml(leg)
            root.appendChild(stopHtml)
            root.appendChild(legHtml)
        })
        let finalStopHtml = createStopHtml(this.destination, false, true)
        root.appendChild(finalStopHtml)

        return root
    }
}

/**
 * 
 * @param {object} leg 
 */
function createLegHtml(leg) {
    let root = elem("div", "leg")
    let departure = elem("p", "time")
    departure.innerText = leg.Origin.time
    let arrival = elem("p", "time")
    arrival.innerText = leg.Destination.time
    let title = elem("p", "mode")
    title.innerText = leg.name
    
    root.appendChild(departure)
    root.appendChild(title)
    root.appendChild(arrival)
    
    let timelineSection = elem("div", "timeline")
    root.appendChild(timelineSection)
    
    timelineSection.appendChild(elem("div", "active line"))
    
    if (leg.sname) {
        title.innerText += ` mot ${leg.direction}`
        let lineNumber= createLineNumberHtml(leg)
        root.appendChild(lineNumber)
    }


    return root
}

function createLineNumberHtml(leg) {

    let root = elem("div", "timeline-center")

    let span = elem("span")
    span.innerText = leg.sname
    span.style.background = leg.fgColor
    span.style.color = leg.bgColor

    root.appendChild(span)

    return root
}

/**
 * 
 * @param {object} stop 
 * @param {boolean} first 
 * @param {boolean} last 
 */
function createStopHtml(stop, first=false, last=false) {
    let root = elem("div", "stop")
    let title = elem("p")
    title.innerText = stop.name
    root.appendChild(title)

    let timelineSection = elem("div", "timeline")
    root.appendChild(timelineSection)
    let before = elem("div", first ? "line" : "active line")
    let after = elem("div", last ? "line" : "active line")
    timelineSection.appendChild(before)
    timelineSection.appendChild(after)
    
    let timelineCenter = elem("div", "timeline-center")
    root.appendChild(timelineCenter)

    let point = elem("div", "point " + ((first || last) ? "filled" : ""))
    timelineCenter.appendChild(point)

    return root
}