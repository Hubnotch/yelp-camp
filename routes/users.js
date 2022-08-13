const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

//Render registration form
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Handle registration form
router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const newUser = await User.register(user, password)
        req.login(newUser, error => {
            if (error) {
                return next(error)
            } else {
                req.flash('success', 'Welcome to Yelp camp')
                res.redirect('/campgrounds')
            }
        })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
})

//Render login page
router.get('/login', (req, res) => {
    res.render('users/login')
})

//Handle user logging in
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

//logout function using passport
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
})

module.exports = router