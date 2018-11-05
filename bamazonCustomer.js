const mysql = require("mysql");
const inquirer = require("inquirer");
//establishes a connection to bamazon database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon"
});
// runs through a customer's transaction
function customerTransaction(){
    let productID;
    let productQty;
    displayProducts()
        .then(getProductID) 
        .then((custInput) => {
            productID = custInput.ID_input;
        })
        .then(getProductQty)
        .then((custInput) => {
            productQty = custInput.product_qty;
        })
        .then(() => {
            checkQty(productID, productQty);
        });
}
//display products table
function displayProducts(){
    return new Promise((resolve) => {
        connection.query({
            sql: "SELECT item_id, product_name, department_name, price FROM products",
            timeout: 40000
        },(error, result) => {
            if(error) throw error;
            productTable(result).then((productTable) => {
                console.log(productTable);
                resolve();
            });
        });
    });
}
// uses npm package table to display products table in a neat table
function productTable(resultArray){
    const {table} = require("table");
    let data = [["Item ID", "Product", "Department", "Price"]];
    let output;
    return new Promise((resolve) => {
        resultArray.forEach((resultObject) => {
            let tempArray = [];
            for(const key in resultObject){
                tempArray.push(resultObject[key]);
            }
            data.push(tempArray);
            output = table(data);
        });
        resolve(output);
    });
}
function getProductID(){
    return inquirer.prompt({
        type: "input",
        name: "ID_input",
        message: "Enter the Item ID of the item you would like to purchase.",
        validate: function(input) {
            return new Promise((resolve) => {
                (typeof parseInt(input) !== 'number')? resolve("You need to enter a number as the Item ID.") :
                (/\d+$/.test(parseInt(input)))? resolve(true) : resolve("The Item ID only includes numbers and my not include characters like * / . ()");
            });
        }
    });
}
function getProductQty(){
    return inquirer.prompt({
        type: "input",
        name: "product_qty",
        message: "Enter the quantity you would like to purchase.",
        validate: function(input) {
            return new Promise((resolve) => {
                const custInput = parseInt(input);
                (typeof custInput !== 'number')? resolve("You need to enter a number as the Item ID.") :
                (/\d+$/.test(custInput) === false)? resolve("The Item ID only includes numbers and my not include characters like * / . ()"):
                (custInput > 0)? resolve(true) : resolve("The Item ID you entered does not exist.");
            });
        }
    });
}
function checkQty(idInput, qtyInput){
    console.log("Inside checkQty function.");
    connection.query({
        sql: "SELECT * FROM products WHERE ?",
        timeout: 30000,
        values: {item_id: idInput}
    }, (error, result) => {
        if(error) throw error;
        productQty = result.RowDataPacket.stock_quantity;
        product = result.RowDataPacket.product_name;
        console.log(productQty);
        (productQty = 0)? console.log(`Sorry, Bamazon is out of the ${product}.`) :
        (productQty < qtyInput)? console.log(`Sorry, Bamazon doesn't have ${qtyInput} of the ${product}. Try purchasing less.`) :
        (console.log(`You successfully purchased ${qtyInput} of the ${product}!`), updateProduct(idInput, qtyInput));
    });
}
function updateProduct(id, qty){
    console.log("inside updateproduct function.");
    console.log(`Product ID: ${id} with qty of ${qty}`);
}
customerTransaction(); 
