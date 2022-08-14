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
const { validateReview, isLoggedin, isReviewAuthor } = require('../authMiddleware')

//Imports from review controller
const reviews = require('../controllers/reviews')

//Reviews Route
router.post('/', validateReview, isLoggedin, asyncErrorHandler(reviews.createReview))


//Delete review Route
router.delete('/:reviewId', isLoggedin, isReviewAuthor, asyncErrorHandler(reviews.deleteReview))


module.exports = router

