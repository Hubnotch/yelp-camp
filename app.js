const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { campgroundSchema, reviewSchema } = require('./schemas');
const asyncErrorHandler = require('./utils/asyncErrorHandler');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const Review = require('./models/review')
// require('./models/review')

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

//Validate Review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
})

const app = express();

//Middleware 
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
//Get all campgrounds from DB
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

//Get New form to create a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//Process Campgrounds creation form
app.post('/campgrounds', validateCampground, asyncErrorHandler(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)

    const campground = await new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


//Get campgrounds by ID
app.get('/campgrounds/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate('reviews')
    res.render('campgrounds/show', { campground })
}))

//Get Edit form to edit campground
app.get('/campgrounds/:id/edit', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

//Update a campgrounds by ID
app.put('/campgrounds/:id', validateCampground, asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

//Delete a campground by ID
app.delete('/campgrounds/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.get('/', (req, res) => {
    res.render('home')
})

//Reviews Route
app.post('/campgrounds/:id/reviews', validateReview, asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    console.log(req.body.review)
    console.log(review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


//Delete review Route
app.delete('/campgrounds/:id/reviews/:reviewId', asyncErrorHandler(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))



//Custom error handling middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, ext) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err });
})






app.listen(process.env.PORT || 3800, () => {
    console.log(`Server is running on port localhost:${process.env.PORT || 3800}`);
})