
const swedishDays = [
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag",
    "söndag"
]

const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

capitalizeString = function(text) {
    words = text.trim().split(/\s+/)
    if (words.length === 1 && words[0] === "") return ""
    return words.map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(" ")
}

const menuParent = document.getElementById("menu-container")

function getJson() {
    let xhr = new XMLHttpRequest()
    
    xhr.open("GET", "/restaurants.json")
    xhr.responseType = "json"
    xhr.onload = renderMenu
    xhr.send()

}

// TODO: make renderDay() function

function renderDay(parent, day, data) {
    let week = data[0].week

    let dayElement = document.createElement("section")
    dayElement.classList.add("day")
    dayElement.classList.add("box-shadow")
    dayElement.id = days[day]
    parent.appendChild(dayElement)

    let dayTitle = document.createElement("h2")
    dayTitle.innerText = `${capitalizeString(swedishDays[day])} vecka ${week}`
    dayElement.appendChild(dayTitle)
    restaurantsDiv = document.createElement("div")

    data.forEach(restaurant => {
        let restaurantDiv = document.createElement("div")
        restaurantDiv.classList.add("restaurant")
        dayElement.appendChild(restaurantDiv)

        let restaurantTitle = document.createElement("h3")
        restaurantTitle.innerText = restaurant.restaurant
        restaurantDiv.appendChild(restaurantTitle)

        restaurant.days[day].forEach(dish => {
            let title = capitalizeString(dish.title)
            let description = dish.description
            let dishText = document.createElement("p")
            dishText.innerHTML = `<b>${title}</b>${title ? " -" : ""} ${description}`
            restaurantDiv.appendChild(dishText)
        })
    })

    return dayElement
}

function renderMenu(event) {
    data = event.target.response

    let today = (new Date().getDay() + 6) % 7

    if (today > 4) today = 0

    for (let day = today; day < 5; day++) {
        dayElement = renderDay(menuParent, day, data)
    }
}



function main() {
    getJson()
}



main()