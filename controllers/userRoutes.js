const express = require('express')
const router = express.Router()
//const axios = require("axios")
const db = require('../models')

//get user update form
router.get("/edit", (req, res)=>{
    res.render("userEdit")
})

//update a user
router.put("/", (req, res)=>{
    // let newName = req.body.name
    // db.user.findOne({
    //     where: {name: req.user.name}
    // })
    // .then(foundUser=> {
    //     console.log("updating this user:", foundUser.name)
    //     FoundUser.update(
    //         { name: newName }
    //         ).then(result=>{
         
    //         console.log('db instance edited: \n', result)
    //         //redirects back to profile ejs
    //         res.redirect("/")
    //     });
    // })
   req.user = res.locals.currentUser
    db.user.update(
        {name: req.body.name},
        {where: {name: req.user.name}}
      )
      .then(updatedUser=>{
          console.log(updatedUser)
        res.redirect("/")
      }) 
})


module.exports = router