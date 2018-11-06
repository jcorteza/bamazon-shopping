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
// runs inquirer to receive a product id from the customer
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
// runs inquirer to receive a qty of the product he or she would like to purchase
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
// checks the current stock of the product and if stock is high enough the order is fulfilled and stock is updated to reflect the customer's purchase
function checkQty(idInput, qtyInput){
    console.log("Inside checkQty function.");
    connection.query({
        sql: "SELECT * FROM products WHERE ?",
        timeout: 30000,
        values: {item_id: idInput}
    }, (error, result) => {
        if(error) throw error;
        if(result.length === 0) {
            console.log("Bamazon could not find that item. Check the product ID and try again.");
            throw Error("Customer entered product ID that does not exist.");
        }
        const productQty = result[0].stock_quantity;
        const product = result[0].product_name;
        if(productQty === 0){
            console.log(`Sorry, Bamazon is out of the ${product}.`);
        }
        else if(productQty < qtyInput){
            console.log(`Sorry, Bamazon doesn't have ${qtyInput} of the ${product}. Try purchasing less.`);
        }
        else {
            const newQty = productQty - qtyInput;
            console.log(`You successfully purchased ${qtyInput} of the ${product}!`); 
            updateProduct(idInput, newQty);
        }
        keepShopping();
    });
}
// updates product's stock after purchase
function updateProduct(id, qty){
    connection.query({
        sql: "UPDATE products SET ? WHERE ?",
        timeout: 30000,
        values: [
            {stock_quantity: qty},
            {item_id: id}
        ]
    }, (error) => {
        if(error) throw error;
    });
}
// uses inquirer package to ask customer if they would like to keep shopping
function keepShopping(){
    inquirer.prompt({
        type: "confirm",
        name: "keepShopping",
        message: "Would you like to keep shopping?",
        default: true
    }).then((response) => {
        if(response.keepShopping){ 
            customerTransaction();
        }
        else{
            connection.end();
            process.exit();
        }
    });
}
customerTransaction(); 
