// **********************************************************************************
// Локально тестируется с использованием postman
// **********************************************************************************

// ******* Определение переменных
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// ******* Технический код модулей
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// ******* Mongo DB 

// Соединение
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

// DB Схема
const articleSchema = 
{
    title: String,
    content: String
};

// DB Модель
const Article = mongoose.model("Article", articleSchema);

// ******* Ядро - get/post 

// Для всех articles: 1) метод route, используя express 2) закомментированные - простое перечисление запросов.

// 1) метод route из express 
app.route("/articles")

.get(function(req, res)
{
    Article.find(function(err, foundArticles)
    {
        if(!err)
        {res.send(foundArticles);}
        else
        {res.send(err);}
    });
})

.post(function(req, res)
{
    // Создание нового документа-схемы в БД
    const newArticle = new Article
    ({
        title: req.body.title,
        content: req.body.content 
    });
    newArticle.save(function(err)
    {
        if(!err)
        {
            res.send("/// app.post to create newArticle completed ///");
        } 
        else 
        {
            res.send(err);
        }
});
})

.delete(function (req, res)
{
Article.deleteMany(function(err)
{
    if (!err)
    {
        res.send("/// app.delete to delete all Article completed ///");
    }
    else 
    {
        res.send(err);
    }
});
});

// 2) перечисление запросов
// GET через все коллекции
// app.get("/articles", function(req, res)
// {
//     // Пустые параметры поиска, потому что поиск всех объектов
//     Article.find(function(err, foundArticles)
//     {
//         if(!err)
//         {res.send(foundArticles);}
//         else
//         {res.send(err);}
//     });
// });

// POST через все коллекции исходя из требований конвенции о наименованиях
// Вместо name, которые были бы в форме - в каждом инпуте и по которым была бы связь с методом post используется парсер по соответстующему свойству
// app.post("/articles", function(req, res)
// {
//     // Создание нового документа-схемы в БД
//     const newArticle = new Article
//     ({
//         title: req.body.title,
//         content: req.body.content 
//     });
//     newArticle.save(function(err)
//     {
//         if(!err){res.send("/// app.post to create newArticle completed ///")} 
//         else {res.send(err);
//     }
// });
// });

// Запрос на DELETE
// app.delete("/articles", function (req, res)
// {
// Article.deleteMany(function(err)
// {
//     if (!err)
//     {
//         res.send("/// app.delete to delete all Article completed ///");
//     }
//     else 
//     {
//         res.send(err);
//     }
// });
// });

// ******* Для специфичных articles (2го уровня)
// Используется express для определения параметра какая конкретно статья будет работать, через переменную articleTitle. Она образуется автоматически
// Если localhost: 3000/articles/jquery
// то он определяет переменную автоматически req.params.articleTitle = jquery
// поэтому можно писать app.route("/articles/:articleTitle") и express будет определять ее самостоятельно

app.route("/articles/:articleTitle")
.get(function(req, res)
{
    Article.findOne({title: req.params.articleTitle}, function (err, foundArticle)
    {
        if(findArticle)
        {
            res.send(foundArticle);
        }
        else
        {
            res.send("/// No articles matching than title was found ///");
        }
    });
})

.put(function(req, res)
{
    Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err)
    {
        if(!err)
        {
            res.send("/// Updating Article completed ///");
        }
        else
        {
            res.send(err);
        } 
    });
})

.patch(function(req, res)
{
Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err)
    {
        if(!err)
        {
            res.send("/// Patching Article completed ///");
        }
        else
        {
            res.send(err);
        } 
    });
})

.delete(function(req, res)
{ 
    Article.deleteOne(
    {title: req.params.articleTitle},
        function(err)
        {if (!err)
        {
            res.send("/// Deleting Article completed ///");
        }
        else 
        {
            res.send(err);
        }
    });
});
// ******* Контроль запуска сервера
app.listen(3000, function() 
{
    console.log("Server started on port 3000");
});