require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
//static middleware
// router.use(express.static( "public"))

const request = require('request'); // "Request" library
const client_id = `${process.env.SPOTIFY_CLIENT_ID}`; // Your client id
const client_secret = `${process.env.SPOTIFY_CLIENT_SECRET}`; // Your secret

//call api
router.post('/results', (req, res) => {
    // your application requests authorization
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            const formData = JSON.parse(JSON.stringify(req.body))
            //console.log('this is data' + formData)
            var year = formData.year
            var genre = formData.genre
            var options = {
                url: `https://api.spotify.com/v1/search?type=track&q=year:${year}%20genre:${genre}&limit=10`,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                let data = body.tracks.items
                //console.log(year)
                if (data.length === 0) {
                    res.render("noresults", {year: year, genre: genre})
                } else{
                res.render("results", {year:year, genre: genre, data: data})
                }
            }
            );
        
            db.user.findOne({
                where: {name: req.user.name}
            })
            .then(foundUser=> {
                console.log("adding favorite to this user:", foundUser.name)
                foundUser.createHistory({
                    genre: genre,
                    year: year
                }).then(res=>{
                    console.log('db instance created: \n', res)
                    //redirects back to favorites ejs
                    //res.redirect("/favorites")
                });
            })
        } 
    })
})

//Retrieve all result histories
router.get('/history', (req, res) => {

    db.user.findOne({
        where: {name: req.user.name}
    })
    .then(foundUser=>{
        foundUser.getHistories().then(histories=>{
            res.render('history', { histories: histories })
        })
    .catch(error =>{
        console.error
        })
    })
})

// //Creates a new result history
// router.post('/history', (req, res) => {
//     const data = JSON.parse(JSON.stringify(req.body))
//     console.log('this is data', data)
//     var historyYear = formData.year
//     var historyGenre = formData.genre

//     db.user.findOne({
//         where: {name: req.user.name}
//     })
//     .then(foundUser=> {
//         console.log("adding favorite to this user:", foundUser.name)
//         foundUser.createHistory({
//             genre: historyGenre,
//             year: historyYear
//         }).then(res=>{
//             console.log('db instance created: \n', res)
//             //redirects back to favorites ejs
//             //res.redirect("/favorites")
//         });
//     })
// })


module.exports = router