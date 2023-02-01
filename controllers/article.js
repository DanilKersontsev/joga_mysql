// import database connection
const con = require('../utils/db');




// show all articles - index page
const getAllArtticles = (req, res) => {
    let query = "SELECT * FROM article";
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        res.render('index', {
            articles: articles
        })
    })
};

//show article by this slug
const getArticleBySlug = (req,res) => {
    let query = `SELECT *, article.name as article_name, author.name as author_name FROM article INNER JOIN author on article.author_id = author.id WHERE slug="${req.params.slug}"`;
    let article
    con.query(query, (err, result) => {
        if (err) throw err;
        article = result
        console.log(article)
        res.render('article', {
            article: article
        })
    });
};

//export controller functions
module.exports = {
    getAllArtticles,
    getArticleBySlug
}