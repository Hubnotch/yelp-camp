const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground')
const methodOverride = require('method-override');

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
app.post('/campgrounds', async (req, res) => {
    const campground = await new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})


//Get campgrounds by ID
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
})

//Get Edit form to edit campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

//Update a campgrounds by ID
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

//Delete a campground by ID
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.get('/', (req, res) => {
    res.render('home')
})








app.listen(process.env.PORT || 3800, () => {
    console.log(`Server is running on port localhost:${process.env.PORT || 3800}`);
})