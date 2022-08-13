const express = require('express')
const router = express.Router()

const { campgroundSchema, reviewSchema } = require('../schemas');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const ExpressError = require('../utils/ExpressError');
const ejsMate = require('ejs-mate');
const passport = require('passport')
const Campground = require('../models/campground')
const methodOverride = require('method-override');
const Review = require('../models/review')
const { isLoggedIn } = require('../authMiddleware')

//Validation of input with Joi
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//Get all campgrounds from DB
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

//Get New form to create a new campground
router. get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

//Process Campgrounds creation form
router.post('/', validateCampground, asyncErrorHandler(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)

    const campground = await new Campground(req.body.campground)
    await campground.save();
    req.flash('success', 'Created Campground successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}))


//Get campgrounds by ID
router.get('/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate('reviews')
    if (!campground) {
        req.flash('success', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

//Get Edit form to edit campground
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('success', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

//Update a campgrounds by ID
router.put('/:id', isLoggedIn, validateCampground, asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated Campground')
    if (!campground) {
        req.flash('success', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.redirect(`/campgrounds/${campground._id}`)
}))

//Delete a campground by ID
router.delete('/:id', isLoggedIn, asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted Campground successfully')

    res.redirect('/campgrounds')
}))




module.exports = router