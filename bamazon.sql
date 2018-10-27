DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INTEGER (10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("keyboard", "electronics", 99.99, 200),
        ("mouse", "electronics", 79.99, 150),
        ("camera", "electronics", 250.00, 50),
        ("gamepad", "electronics", 50.50, 300),
        ("paper towels", "cleaning supplies", 8.99, 1000),
        ("cups", "kitchen", 5.99, 2000),
        ("folding chair", "furniture", 20.99, 500),
        ("toothpaste", "health", 5.99, 1200),
        ("toothbrush", "health", 2.99, 5000),
        ("printer paper", "office", 10.00, 5000),
        ("black jacket", "clothing", 49.99, 250);