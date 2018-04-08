var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "products",
});

getInput();
connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
});

function getInput() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        choices: ["Post an item", "Bid on an item"],
        message: "What you want?",
      },
    ])
    .then(answer => {
      if (answer.choice === "Post an item") {
        inquirer
          .prompt([
            {
              name: "name",
              message: "What is the name of your item?",
            },
            {
              name: "price",
              message: "What is the starting bid?",
            },
          ])
          .then(answers => {
            postItem(answers);
          });
      } else {
        getInfo();
      }
    });
}

function postItem(item) {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO items SET ?",
    {
      name: item.name,
      price: parseFloat(item.price),
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      // updateProduct();
    }
  );

  connection.end();
}

function bidItem() {}

function getInfo() {
  connection.query("select * from items", function(error, result) {
    if (error) {
      return console.log(error);
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "item_name",
          message: "Select an item to bid on",
          choices: result,
        },
      ])
      .then(answer => {
        inquirer.prompt([
          {
            name: "currentBid",
            message: answer, //theres a problem here. An object comes back but i can't access the correct part of the object
          },
          {
            name: "userBid",
            message: "And how much do you want it for?",
          },
        ]);
      });
  });
}
