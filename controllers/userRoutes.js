const express = require('express')
const router = express.Router()
//const axios = require("axios")
const db = require('../models')

//get user update form
router.get("/edit", (req, res)=>{
    res.render("user/userEdit")
})

//update a user
router.put("/", (req, res)=>{
   req.user = res.locals.currentUser
    db.user.update(
        {name: req.body.name},
        {where: {name: req.user.name}}
      )
      .then(updatedUser=>{
          console.log(updatedUser)
        res.redirect("/profile")
      }) 
})


module.exports = router