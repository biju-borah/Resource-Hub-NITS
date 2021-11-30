 const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('../config/keys');


//configuring passport
require('../config/passport')(passport);

const app = express();
app.use(express.json())

//configuring db
mongoose.connect('mongodb+srv://tecnoesis:tecnoesis@cluster0.m0nlm.mongodb.net/ResourceHub?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=> console.log("MongoDB connected"))
  .catch(err => console.log(err));



const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const profileRouter = require('./routes/profile');
const notesRouter = require('./routes/notes');
const chatBotRouter = require('./routes/chatbot');

//EJS

// app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser

app.use(express.urlencoded({ extended: true }));


//Express Session Middleware

//If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express:

//app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}));

app.use(session({
  secret: 'resourcehub',
  resave: false,
  saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash

app.use(flash());

//global vars for flash
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.profile_msg = req.flash('profile_msg');
    res.locals.notes_msg = req.flash('notes_msg');

    next();
})


//for static page
const publicDirectoryPath = path.join(__dirname,'../Public');
app.use(express.static(publicDirectoryPath));

//for Routes
app.use('/',indexRouter);
app.use('/users',userRouter);
app.use('/users',profileRouter);
app.use('/users',notesRouter);

// For Chatbot
app.use("/api/chatbot", chatBotRouter);


app.get('*',(req,res)=>{
    res.render('error')
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server started on PORT :", PORT);    
})

