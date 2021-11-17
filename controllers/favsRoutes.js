const express = require('express')
const router = express.Router()
//const axios = require("axios")
const db = require('../models')

//Retrieve all favorited tracks
router.get('/', (req, res) => {

    db.user.findOne({
        where: {name: req.user.name}
    })
    .then(foundUser=>{
        foundUser.getFavorites().then(favorites=>{
            res.render('favorites/faves', { favorites: favorites })
        })
    .catch(error =>{
        console.error
        })
    })
})

//Creates a new favorite track
router.post('/', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body))
    //console.log('this is data', data)

    db.user.findOne({
        where: {name: req.user.name}
    })
    .then(foundUser=> {
        //console.log("adding favorite to this user:", foundUser.name)
        foundUser.createFavorite({
            trackName: data.name,
            trackLink: data.link
        }).then(fav=>{
            console.log('db instance created: \n', fav)
            //redirects back to favorites ejs
            res.redirect("/favorites")
        });
    })
})

//Deletes a favorite track
router.delete('/', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body))
    db.favorite.destroy({
        where: {userId: req.user.id, trackName: data.name, trackLink: data.link}})
    .then(deletedFavorite=> {
            console.log('db instance deleted: \n', deletedFavorite)
            //redirects back to favorites ejs
            res.redirect("/favorites")
    });
})

module.exports = router