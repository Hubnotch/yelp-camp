const express = require('express')
const router = express.Router()

const { campgroundSchema, reviewSchema } = require('../schemas');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const ExpressError = require('../utils/ExpressError');
const ejsMate = require('ejs-mate');
const Campground = require('../models/campground')
const methodOverride = require('method-override');
const Review = require('../models/review')

//Validation of input with Joi
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
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
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

//Process Campgrounds creation form
router.post('/', validateCampground, asyncErrorHandler(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)

    const campground = await new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


//Get campgrounds by ID
router.get('/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate('reviews')
    res.render('campgrounds/show', { campground })
}))

//Get Edit form to edit campground
router.get('/:id/edit', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

//Update a campgrounds by ID
router.put('/:id', validateCampground, asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

//Delete a campground by ID
router.delete('/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))




module.exports = router