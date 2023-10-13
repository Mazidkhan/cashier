const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/assets",express.static("assets"));
app.get('/generate-pdf', (req, res) => {
    const cashierName = req.query.cashierName;
    const customerName = req.query.customerName;
    const orderNo = req.query.orderNo;
    const dishList = JSON.parse(req.query.dishList);
    const payMode = req.query.payMode;

    const fs = require('fs');
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(`public/order_${orderNo}.pdf`));
    doc.fontSize(20).text(`Order No: ${orderNo}`, 100, 50);
    doc.fontSize(14).text(`Cashier: ${cashierName}`, 100, 100);
    doc.fontSize(14).text(`Customer: ${customerName}`, 100, 150);
    doc.fontSize(14).text(`Payment: ${payMode}`, 100, 150);

    let y = 200;
    for (const dish of dishList) {
        doc.fontSize(12).text(dish, 100, y);
        y += 20;
    }

    doc.end();

    res.send('PDF generated successfully');
});
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect(`/welcome?username=${username}`);
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

app.post('/insert', (req, res) => {
    const { cashierName, customerName, orderNo, orderDate, total,dish,quantity, branchName ,payMode} = req.body;
    console.log(cashierName, customerName, orderNo, orderDate, total,dish,quantity,branchName,payMode)
    const sql = `INSERT INTO orders (cashier_name, customer_name, order_no, order_date,total,dish,quantity,branch_name,pay_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [cashierName, customerName, orderNo, orderDate, total,dish,quantity, branchName, payMode], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.sendStatus(500);
            return;
        }
        console.log('Data inserted');
        res.sendStatus(200);
    });
});



// when login is success
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html")
})


// set app port 
app.listen(4000);