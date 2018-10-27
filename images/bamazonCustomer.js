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
    displayStock();
});

function displayStock() {
    console.log("Products available: \n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`
            =======
            Product id: ${res[i].item_id}
            Item: ${res[i].product_name}
            Price: ${res[i].price}
            =======
            `);     
        }
        pickProduct();
    });

}

function pickProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if(err) throw err;
        var choiceArray = [];
        for(var i = 0; i < results.length; i++){
            choiceArray.push(results[i].item_id.toString());
        }
        inquirer.prompt([
            {
                name: "productChoice",
                type: "list",
                message: "Please pick a product to purchase by [Product ID]",
                choices: choiceArray
            },
            {
                name: "quantityChoice",
                type: "input",
                message: "How Many Would you like to purchase?"
            }
        ])
        .then(function (answer) {
            var productSelected;
            for (var k = 0; k < results.length; k++) {
                if (results[k].item_id === parseInt(answer.productChoice)) {
                    productSelected = results[k];
                }
            }
            if (productSelected.stock_quantity > answer.quantityChoice) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: productSelected.stock_quantity - answer.quantityChoice
                        },
                        {
                            item_id: productSelected.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log(`Thank you for purchasing: ${productSelected.product_name}
                                     You have spent \$${productSelected.price * answer.quantityChoice}`);
                    }
                )
            } else {
                console.log("We do not have enough stock to fulfil your purchase, please enter a lower quantity or try again later.");
            }
        });
    });
}