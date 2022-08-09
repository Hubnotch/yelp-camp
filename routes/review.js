const express = require('express');
const router = express.Router({ mergeParams: true });
const { campgroundSchema, reviewSchema } = require('../schemas');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const ExpressError = require('../utils/ExpressError');
const ejsMate = require('ejs-mate');
const Campground = require('../models/campground')
const methodOverride = require('method-override');
const Review = require('../models/review')
const app = express();




//Validate Review with Joi
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//Reviews Route
router.post('/', validateReview, asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


//Delete review Route
router.delete('/:reviewId', asyncErrorHandler(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))








module.exports = router

