const asyncErrorHandler = require('./utils/asyncErrorHandler');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground')
const Review = require('./models/review')


module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

//Validation of input with Joi
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//Authorisation Middleware for Author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}
//Authorisation Middleware for Review Author
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//Validate Review with Joi
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}