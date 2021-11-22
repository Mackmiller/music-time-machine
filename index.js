require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require("method-override")
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

//static middleware
app.use(express.static( "public"))

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)
//PUT middleware
app.use(methodOverride("_method"))
// body parser middelware
app.use(express.urlencoded({extended:false}))
// session middleware
app.use(session({
    secret: process.env.SUPER_SECRET_SECRET,
    resave: false,
    saveUninitialized: true
}))
// passport middleware
app.use(passport.initialize())
app.use(passport.session())
// flash middleware (must go AFTER session middleware)
app.use(flash())
// custom middleware
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next()
})
// controllers middleware 
app.use('/auth', require('./controllers/auth'))
app.use('/search', require('./controllers/searchRoutes'))
app.use('/favorites', require('./controllers/favsRoutes'))
app.use('/profile', require('./controllers/userRoutes'))


// home route
app.get('/', (req, res)=>{
    res.render('home')
})

// profile route
app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('user/profile')
})

// search route
app.get('/search', isLoggedIn, (req, res)=>{
    res.render('search/search')
})

// search results route
app.get('/search/results', isLoggedIn, (req, res)=>{
    res.render('search/results')
})

// favorites route
app.get('/favorites', isLoggedIn, (req, res)=>{
    res.render('favorites/faves')
})

// history route
app.get('/search/history', isLoggedIn, (req, res)=>{
    res.render('search/history')
})





app.listen(process.env.PORT || 3000, ()=>{
    console.log("auth_practice running on port 3000")
})