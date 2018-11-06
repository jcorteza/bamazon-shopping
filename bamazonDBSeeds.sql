DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
('Over-the-Ear Headphones', 'Electronics', 149.99, 20),
('Bass Guitar-Electric', 'Musical Instrument', 325.99, 10),
('Electronic Keyboard', 'Musical Instrument', 110.99, 15),
('French Press', 'Kitchen & Dining', 27.99, 50),
('Stainless Steel Mug', 'Kitchen & Dining', 19.99, 75),
('Kitchen Aid Stand Mixer', 'Kitchen & Dining', 279.99, 30),
('Liquid Silicone iPhone Case', 'Electronics', 16.99, 100),
('Hard Plastic Samsung Galaxy Case', 'Electronics', 12.99, 90),
('Prismacolor Premier Colored Pencils-48 Count', 'Arts & Crafts', 23.99, 40),
('Oversized Gray Hoodie', 'Apparel', 32.99, 75),
('Newborn Pup (Any Breed)', 'Pets', 119.99, 20);

SELECT * FROM products;
