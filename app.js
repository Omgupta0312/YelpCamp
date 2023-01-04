const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Joi = require('joi')
const cors = require("cors")
const session = require('express-session')
const flash = require('connect-flash')

const ExpressError = require("./utils/ExpressError")


//routes-------------------------------
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


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



const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname ,'public')))

const sessionConfig = {
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)



app.get('/', (req, res) => {
    // res.send('Hello From Yelp Camp')
    res.render('home')
})
app.all("*", (req, res, next) => {
    // res.send("404!!")
    next(new ExpressError('Page Not Found', 404));

})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if(!err.message) err.message="Something went wrong";
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})