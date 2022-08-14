const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

//import from controller
const users = require('../controllers/users')


/* 
Render registration form
Handle registration form to create user
*/
router.route('/register')
    .get( users.renderRegister)
    .post(asyncErrorHandler(users.register))


/* 
Render login page
Handle user logging in
*/
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//logout function using passport
router.get('/logout', users.logout)

module.exports = router