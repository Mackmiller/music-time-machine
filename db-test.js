// Make sure to require your models in the files where they will be used.
const db = require('./models');

db.favorite.create({
    trackName: 'Blackbird - Remastered 2009',
    trackLink: 'https://open.spotify.com/track/5jgFfDIR6FR0gvlA56Nakr'
  }).then(fav => {
    console.log('Created: ', fav.trackName)
  })

db.favorite.findOne({
  where: {
    trackName: 'Blackbird - Remastered 2009'
  }
}).then(fav => {
  console.log('Found: ', fav.trackName)
})