var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    selectAdmin();
});

function selectAdmin() {
    inquirer.prompt([
        {
            name: "adminTask",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
        .then(function (answer) {
            if (answer.adminTask === "View Products for Sale") {
                console.log("Products available: \n");
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        console.log(`
                    =======
                    Product id: ${res[i].item_id}
                    Item: ${res[i].product_name}
                    Price: ${res[i].price}
                    Quantity: ${res[i].stock_quantity}
                    =======
                    `);
                    }
                });
            } else if (answer.adminTask === "View Low Inventory") {
                console.log("Low Quantities detected: \n");
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity < 5) {
                            console.log(`
                            ${res[i].product_name}`);
                        }
                    }
                });

            } else if (answer.adminTask === "Add to Inventory") {
                connection.query("SELECT * FROM products", function (err, res) {
                    inquirer.prompt([
                        {
                            name: "addInv",
                            type: "list",
                            message: "What item are you adding stock to?",
                            choices: function () {
                                var itemsArray = [];
                                for (var i = 0; i < res.length; i++) {
                                    itemsArray.push(res[i].product_name);
                                }
                                return itemsArray;
                            }
                        },
                        {
                            name: "quantityAdd",
                            type: "input",
                            message: "How many would you like to add?"
                        }
                    ]).then(function (answer2) {
                        var itemSelected;
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].product_name === answer2.addInv) {
                                itemSelected = res[i];
                            }
                        }
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: itemSelected.stock_quantity + parseInt(answer2.quantityAdd)
                                },
                                {
                                    product_name: itemSelected.product_name
                                }
                            ], function(error){
                                if (error) throw error;
                                console.log(`You have added: ${answer2.quantityAdd} ${itemSelected.product_name}s`);
                            }
                        );
                    });
                })
            } else if (answer.adminTask === "Add New Product") {
                    inquirer.prompt([
                        {
                            name: "product_to_add",
                            type: "input",
                            message: "What would you like to add?"
                        },
                        {
                            name: "department",
                            type: "input",
                            message: "What department does it belong to?"
                        },
                        {
                            name: "price",
                            type: "input",
                            message: "How much does it cost?",
                        },
                        {
                            name: "stock_quantity",
                            type: "input",
                            message: "How many would you like to add?",
                        }
                    ])
                    .then(function(answer){
                        connection.query(
                            "INSERT INTO products SET?",
                            {
                                product_name: answer.product_to_add,
                                department_name: answer.department,
                                price: answer.price,
                                stock_quantity: answer.stock_quantity
                            },
                            function(err){
                                if(err) throw err;
                                console.log("Thank you for adding :" + answer.product_to_add);
                            }
                        )
                    });
            }
        });
}