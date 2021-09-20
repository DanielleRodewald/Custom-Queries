const express = require("express");
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = 8080;  

app.listen(PORT, () => console.log('notes-app listening on port ' + PORT));


const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite" 
});

sequelize.authenticate()
    .then(() => {
        console.log("connection is establised successfully.");
    })
    .catch(err => {
        console.log("unable to connect to the database:", err);

    });

const Note = sequelize.define("meals", {
    breakfast: Sequelize.STRING,
    lunch: Sequelize.STRING,
    dinner: Sequelize.STRING,
    
});

sequelize.sync({ force: true })
    .then(() => {
        console.log("Database and tables have been created ");

Note.bulkCreate([
    { breakfast: "smoothie", lunch: "salad", dinner: "quinoa and veggies" },
    { breakfast: "coffee with almond milk", lunch: "mixed fruit", dinner: "cauliflower rice" },
    { breakfast: "apple", lunch: "burrito bowl", dinner: "salad" },
    { breakfast: "apple", lunch: "hummus and mixed veggies", dinner: "baked potatoes" }
]).then(function () {
        return Note.findAll();
    }).then(function (meals) {
        console.log(meals);
    });

    });

app.get("/", function (req, res) {
    Note.findAll().then (meals => res.json (meals));
});

app.get("/meals/:id", function (req, res) {
    Note.findAll({ where: { id: req.params.id} }).then(meals => res.json(meals));
});

app.post ("/", function (req, res)
{
    Note.create ({
        breakfast: req.body.breakfast, lunch: req.body.lunch, dinner: req.body.dinner
    })
    .then (function (meals){
        res.json(meals)
        console.log ("you added a meal"); 
    });
});

