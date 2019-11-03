const express = require("express");
const router = express.Router();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
let axios = require("axios");
let cheerio = require("cheerio");
let mongoose = require("mongoose");

// Require all models
let db = require("../models");

function getNote(id) {
    console.log(id + "in note function");
    db.Note.find({Article: id}).then((notes)=> {
        console.log(notes);
        return notes;
    });
};

// Get route for dashboard
router.get('/', function (req, res) {
    db.Article.find({}).then((data) => {
        res.render("dashboard", { articles: data });
    });
});

// saved article button
router.get('/saved', (req, res) => {
    db.Article.find({}).then((data) => {
        console.log(data[0]);
        let notes = getNote(data[0].id);
        console.log(data[0].id);
        console.log(notes);
        res.render("savedArticles", { articles: data, notes: notes });
    });
});

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios

    // "https://www.npr.org/sections/technology/"
    axios.get("https://www.npr.org/sections/technology/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        // With cheerio, find each div
        // (i: iterator. element: the current element)
        $("article.has-image").each(function (i, element) {
            let title = $(element).find("h2.title").text().trim();
            let body = $(element).find("p.teaser").text().trim();
            let note = [];
            // console.log(title);
            // console.log(body);
            // Build a find in the database to stop duplicate entries
            // Create a new Article using the `result` object built from scraping
            db.Article.find({ title: title }).then((data) => {
                if (data.length === 0) {
                    db.Article.create({ title, body, note })
                        .then(function (dbArticle) {
                            // View the added result in the console
                            // console.log(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, log it
                            console.log(err);
                        });
                }
            })
                .then(() => {
                    // Send a message to the client
                    // res.send("Scrape Complete");
                    res.status(200);
                    res.redirect("/")
                });
        });
    });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


module.exports = router

