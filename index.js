// aplication packages
const express = require('express')
const app = express()

const path = require('path')
// add template engine
const hbs = require('express-handlebars')
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine ({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
}))
// setup static public directory
app.use(express.static('public'));


const mysql = require('mysql')

const bodyParser = require('body-parser')
const {auth} = require("mysql/lib/protocol/Auth");
app.use(bodyParser.urlencoded({extended: true}))

// create database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
})

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to joga_mysql db");
})
const articleRoutes = require('./routes/article'); // import article route

// to use article routes
app.use('/', articleRoutes);
app.use('/article', articleRoutes)


// show all articles - index page
app.get('/', (req, res) => {
    let query = "SELECT * FROM article";
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        // console.log(articles)
        res.render('index', {
            articles: articles
        })
    })
});

//show article by this slug
app.get('/article/:slug', (req, res) => {
    let query = `SELECT *, article.name as article_name, author.name as author_name FROM article INNER JOIN author on article.author_id = author.id WHERE slug="${req.params.slug}"`;
    let article
    con.query(query, (err, result) => {
        if (err) throw err;
        article = result
        console.log(article)
        res.render('article', {
            article: article
        })
    })
})
app.get('/author/:author_ID', (req,res) =>{
    let query = `SELECT * FROM author WHERE id="${req.params.author_ID}}"`
    let author = []
    con.query(query, (err, result) =>{
        if(err) throw err;
        author = result
        console.log(author)
        query = `SELECT * FROM article WHERE author_id="${req.params.author_ID}}"`
        let articles = []
        con.query(query, (err, result) => {
            if (err) throw err;
            articles = result
            console.log(articles)
            res.render('author', {
                author: author,
                articles: articles
            })
        })
    })
})


// app start point
app.listen(3000, () => {
    console.log('app is started at http://localhost:3000');
});
