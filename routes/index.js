var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index')
})

/* GET map page */
router.get("/map", (req, res, next) => {
    res.render("map")
})

/* GET time-left page */
router.get("/time-left", (req, res, next) => {
    res.render("time-left")
})


module.exports = router
