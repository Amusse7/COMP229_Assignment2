/*
	Filename: index.js
	Name: Abdulkadir Musse
	Student ID: 300988847
	Date: 2022-10-21
*/

var express = require('express');
var router = express.Router();
var Users = require('../models/User');
var Contacts = require('../models/Contact');

/*
    Middleware to allow access to routes only when the user is logged in,
    redirect to the login page otherwise
*/
const restrictAuth=(req,res,next)=>{
    if(req.session.isLoggedIn) {
        next();
    }
    else {
        res.redirect('/login');
    }
};

router.get('/', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Web Developer",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/index',{global_data:global_data});
});

router.get('/services', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Services",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/services',{global_data:global_data});
});

router.get('/projects', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Projects",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/projects',{global_data:global_data});
});

router.get('/login', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Login",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/login',{global_data:global_data, submitRes:""});
});

router.get('/signup', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Signup",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/signup',{global_data:global_data, submitRes:""});
});

router.get('/contact/:id', restrictAuth, async function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Update Contact",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/contactlist-update', {global_data:global_data, contact: await Contacts.findById(req.params.id)});
});

router.get('/contact', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Contact",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/contact',{global_data:global_data});
});

router.get('/aboutme', function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - About Me",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/aboutme',{global_data:global_data});
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

/* restrictAuth middleware is used in the 3 routes below to prevent unauthorized access to contacts pages */
router.get('/view-contacts', restrictAuth, async function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Contact List",
        "isLoggedIn": req.session.isLoggedIn
    };

    var contacts=await Contacts.find({user: req.session.userId});
    res.render('pages/contactlist',{global_data:global_data, contacts:contacts});
});

router.get('/add-contact', restrictAuth, function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Add Contact",
        "isLoggedIn": req.session.isLoggedIn
    };
    res.render('pages/contactlist-add',{global_data:global_data});
});


/*
    POST request handler for /login, find user with the given username/password pair and redirects user on correct credentials
*/
router.post('/login', async function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Projects"
    };

    console.log(req.body);
    let submitRes="";
    var user=await Users.findOne({"username":req.body.username, password:req.body.password});

    // Check if the user was found
    if(!user) {
        submitRes="Invalid Credentials";
        res.render('pages/login',{global_data:global_data, submitRes:submitRes});
    }
    else 
    {
        req.session.isLoggedIn=true;
        req.session.userId = user._id;
        res.redirect("/view-contacts");
    }
});

router.post('/signup', async function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Signup",
        "isLoggedIn": req.session.isLoggedIn
    };

    if(req.body.username && req.body.password) {
        if(req.body.password == req.body.cpassword) {
            let user = new Users(req.body);
            await user.save();
            submitRes = "Account created";
        } else {
            submitRes = "Passwords do not match";
        }
    } else {
        submitRes = "All fields are required";
    }

    res.render('pages/signup',{global_data:global_data, submitRes});
});

// POST: Update contact
router.post('/contact-update/:id', restrictAuth, async (req, res) => {
    let id = req.params.id;

    console.log(req.body);

    await Contacts.findByIdAndUpdate(id, req.body);
    res.redirect('/view-contacts');
});

// POST: Delete contact
router.post('/contact-delete/:id', restrictAuth, async (req, res) => {
    let id = req.params.id;
    console.log("Deleting contact: ", id);
    await Contacts.findOneAndDelete({_id: id});
    res.redirect('/view-contacts');
});

router.post('/add-contact', restrictAuth, async function(req, res) {
    var global_data={
        "page_title":"Abdulkadir Musse - Add Contact"
    };
    
    // Save the contact
    await(new Contacts({name:req.body.name, email:req.body.email, phone: req.body.phone, user: req.session.userId}).save());

    res.redirect('/view-contacts');
});

module.exports = router;