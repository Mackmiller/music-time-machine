require('dotenv').config()
const express = require('express')
const router = express.Router()

const request = require('request'); // "Request" library
const client_id = `${process.env.SPOTIFY_CLIENT_ID}`; // Your client id
const client_secret = `${process.env.SPOTIFY_CLIENT_SECRET}`; // Your secret

router.get('/:name', (req, res) => {
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
        var year = 1968
        var genre = "rock"
        var options = {
            url: `https://api.spotify.com/v1/search?type=track&q=year:${year}%20genre:${genre}&limit=10`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        request.get(options, function(error, response, body) {

            let data = body.tracks.items

            // data.forEach(track =>{
            //   console.log(`track name: ${track.name}, album popularity: ${track.popularity}`)
            // })

            
            res.render("results/show", {data: data})


        });
    }
})
})



module.exports = router