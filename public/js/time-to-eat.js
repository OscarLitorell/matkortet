
/**
 * Create a new element
 * @param {string} type 
 * @param {string=""} classes 
 * @param {id=null} id
 */
function elem(type, classes="", id=null, children=[]) {
    let e = document.createElement(type)
    classes = classes.trim()
    if (classes.length > 0)
        classes.split(" ").forEach(c => e.classList.add(c))
    if (id) e.id = id

    children.forEach(child => {
        e.appendChild(child)
    })

    return e
}

function createRestaurantCard(restaurant) {
    let root = elem("div", "", `restaurant-${restaurant.id}`)
    let title = elem("h4")
    title.innerText = restaurant.name
    root.appendChild(title)

    let timeToEat = elem("p", "time-to-eat")
    let tripSection = elem("div", "trips")
    
    root.appendChild(timeToEat)
    root.appendChild(tripSection)

    
    let toggler = elem("p", "toggler")
    tripSection.appendChild(toggler)
    
    let journeyElement = elem("div")
    tripSection.appendChild(journeyElement)
    
    createToggler(toggler, e => e.innerText = "Dölj tidsplan", e => e.innerText = "Visa tidsplan", journeyElement, "visible")

    let initialOpen = function () {
        getTrip(root, journeyElement, restaurant.id)

        toggler.removeEventListener("click", initialOpen)
    }

    toggler.addEventListener("click", initialOpen)


    return root
}


async function getRestaurants() {
    let response = await fetch("/api/restaurants")
    return JSON.parse(await response.text())
}

async function addRestaurants() {
    let restaurants = await getRestaurants()
    let root = elem("section", "card", "restaurants")

    restaurants.forEach(restaurant => {
        root.appendChild(createRestaurantCard(restaurant))
    })

    document.querySelector("main").appendChild(root)
}


async function getTrip(restaurantElement, journeyElement, restaurantId) {
    let startTime = document.getElementById("startTime").value
    let endTime = document.getElementById("endTime").value
    
    let margin = document.getElementById("margin").value * 60
    
    startTime = timeDelta(startTime, margin)
    endTime = timeDelta(endTime, -margin)
    
    let id = restaurantId
    
    let res = await fetch(`/api/journey?destinationId=${id}&startTime=${startTime}&endTime=${endTime}`)
    let journey = new Journey(await res.json())


    if (!journey.completeJourney) {
        journeyElement.innerHTML = "Kunde inte hitta rutt."
    } else {
        let tripThereHtml = journey.tripThere.createHtml()
        let tripBackHtml = journey.tripBack.createHtml()
        
        let timeToEatElement = restaurantElement.getElementsByClassName("time-to-eat")[0]
        timeToEatElement.innerHTML = `Tid att äta: <b>${Math.round(journey.timeToEat)}</b> minuter (${journey.tripThere.destination.time} till ${journey.tripBack.origin.time}).`
    
        journeyElement.appendChild(tripThereHtml)
        journeyElement.appendChild(tripBackHtml)
    }
}


/**
 * When clicking a certain element, toggle the class of another element, and do somwthing to the current element.
 * @param {HTMLElement} toggler The element that is clicked
 * @param {function(HTMLElement)} selfOn The function that is called with the clicked element when it is turned on.
 * @param {function(HTMLElement)} selfOff The function that is called with the clicked element when it is turned off.
 * @param {HTMLElement} targetElement The function whose class should be toggled.
 * @param {string} classToggle The class to toggle.
 */
function createToggler(toggler, selfOn, selfOff, targetElement, classToggle) {
    toggler.addEventListener("click", () => {
        targetElement.classList.toggle(classToggle)
        let func = targetElement.classList.contains(classToggle) ? selfOn : selfOff
        func(toggler)
    })
    selfOff(toggler)
}

window.addEventListener("load", () => {
    addRestaurants()
})



/**
 * 
 * @param {string} time 
 * @param {*} seconds 
 */
function timeDelta(time, seconds) {
    let out = new Date(new Date("2000-01-01T" + time).getTime() + seconds * 1000)
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