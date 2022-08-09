const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')
const app = express();

const campgrounds = require('./routes/camground')
const reviews = require('./routes/review')

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

//Middleware 
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'Ineedabettersecrethere',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: Date().now + 1000 * 60 * 60 * 24 * 7
    }
}))
//Use router middleWare
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
})



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