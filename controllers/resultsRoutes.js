require('dotenv').config()
const express = require('express')
const router = express.Router()
//static middleware
// router.use(express.static( "public"))

const request = require('request'); // "Request" library
const client_id = `${process.env.SPOTIFY_CLIENT_ID}`; // Your client id
const client_secret = `${process.env.SPOTIFY_CLIENT_SECRET}`; // Your secret

//Creates a genre and year in results table from user input 
// router.post('/', (req, res) => {
//     const data = JSON.parse(JSON.stringify(req.body))
//     console.log('this is data', data) //this works:
//     // this is data { genre: 'rock', year: '1980' }
//     db.user.findOne()
//     .then(user=> {
//         console.log("adding genre and year to this user:", user.name)
//         //name of table will be result
//         user.createResult({
//             genre: data.genre,
//             year: data.year
//         }).then(res=>{
//             console.log('db instance created: \n', res)
//             //redirects back to favorites ejs
//             res.redirect("/search/results")
//         });
//     })
// })

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
            //console.log('this is data', formData)
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
                res.render("results", {data: data})
            });
        }
    })
})



module.exports = router