
const mongoose = require('mongoose')
const { Schema } = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    review: Number
})

mongoose.export = mongoose.model('Review', reviewSchema)