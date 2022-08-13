const express = require('express');
const path = require('path');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const app = express();

//ROUTERS
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/users')

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
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))

/* Adding a session */
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

//Initialize and use passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//Using flash middleware
app.use((req, res, next) => {
    res.local.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

//Testing passport function 
// app.get('/fakeuser', async (req, res) => {
//     const user = new User({ email: 'love2ekene@gmail.com', username: 'Hubnotch' })
//     const newUser = await User.register(user, 'hubnotch')
//     res.send(newUser)
// })

//Use router middleWare
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

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