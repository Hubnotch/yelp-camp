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

/* 
load the index page
create new campground
*/
router.route('/')
    .get(asyncErrorHandler(campgrounds.index))
    .post(isLoggedIn, validateCampground, asyncErrorHandler(campgrounds.createCampground))


//Get New form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

/* 
Process Campgrounds creation form
Get campgrounds by ID
Update a campgrounds by ID
Delete a campground by ID
*/
router.route('/:id')
    .get(asyncErrorHandler(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, asyncErrorHandler(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncErrorHandler(campgrounds.deleteCampground))


//Get Edit form to edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, asyncErrorHandler(campgrounds.renderEditForm))




module.exports = router