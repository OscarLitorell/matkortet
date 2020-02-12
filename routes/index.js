const express = require('express')
let router = express.Router()

const api = require("./api.js")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index')
})

/* GET map page */
router.get("/karta", (req, res, next) => {
    res.render("map")
})

/* GET time-left page */
router.get("/hinner-jag", (req, res, next) => {
    res.render("time-to-eat")
})

api.attachRoutes(router)

module.exports = router
