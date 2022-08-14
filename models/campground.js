const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user")

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    geometry:{
        type:{
            type:String,
            enums:["Point"],
            required:true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

//To delete All Reviews associated with a Campground
CampgroundSchema.post("findOneAndDelete", async function (data) {
    if (data) {
        await Review.deleteMany({ id: { $in: data.reviews } });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
