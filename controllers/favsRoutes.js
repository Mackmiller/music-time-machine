const express = require('express')
const router = express.Router()
//const axios = require("axios")
const db = require('../models')

//Retrieve all favorited tracks
router.get('/', (req, res) => {

    db.user.findOne()
    .then(user=>{
        user.getFavorites().then(favorites=>{
            res.render('faves', { favorites: favorites })
        })
    .catch(error =>{
        console.error
        })
    })
})

//Creates a new favorite track
router.post('/', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body))
    console.log('this is data', data)

    db.user.findOne()
    .then(user=> {
        console.log("adding favorite to this user:", user.name)
        user.createFavorite({
            trackName: data.name,
            trackLink: data.link
        }).then(fav=>{
            console.log('db instance created: \n', fav)
            //redirects back to favorites ejs
            res.redirect("/favorites")
        });
    })
})

module.exports = router