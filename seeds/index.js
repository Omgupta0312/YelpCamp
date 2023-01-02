const mongoose = require('mongoose');

const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((data) => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("ERROR!!")
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *50)+10;
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,

            title: `${sample(descriptors)} ${sample(places)}`,

            image:"https://source.unsplash.com/collection/483251",

            description:"Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.",

            price
        })
        await camp.save();

    }
    const c = new Campground({ title: 'purple field' })
    await c.save();
}

seedDB();