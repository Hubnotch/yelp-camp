const express = require('express')
const router = express.Router()

const { campgroundSchema, reviewSchema } = require('../schemas');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const ExpressError = require('../utils/ExpressError');
const ejsMate = require('ejs-mate');
const passport = require('passport')
const Campground = require('../models/campground')
const methodOverride = require('method-override');
const Review = require('../models/review')
const { isLoggedIn, isAuthor, validateCampground } = require('../authMiddleware')
//imports from cotrollers
const campgrounds = require('../controllers/campgrounds')


//Get all campgrounds from DB
router.get('/', asyncErrorHandler(campgrounds.index))

//Get New form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//Process Campgrounds creation form
router.post('/', isLoggedIn, validateCampground, asyncErrorHandler(campgrounds.createCampground))


//Get campgrounds by ID
router.get('/:id', asyncErrorHandler(campgrounds.showCampground))

//Get Edit form to edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, asyncErrorHandler(campgrounds.renderEditForm))

//Update a campgrounds by ID
router.put('/:id', isLoggedIn, isAuthor, validateCampground, asyncErrorHandler(campgrounds.updateCampground))

//Delete a campground by ID
router.delete('/:id', isLoggedIn, isAuthor, asyncErrorHandler(campgrounds.deleteCampground))




module.exports = router