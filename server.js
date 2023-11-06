const mysql = require("mysql2");
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
const connection = mysql.createPool({
    //freedatabase.com

    host: 'sql12.freesqldatabase.com',
    user: 'sql12659463',  // Replace with your MySQL username
    password: 'bQm5ljbfV4',  // Replace with your MySQL password
    database: 'sql12659463'  // Replace with your database name
      
});

// connect to the database
connection.getConnection(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.get("/sales",function(req,res){
    res.sendFile(__dirname + "/sales.html");
})


app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,result,fields){
        /*if (result.length >= 1) {*/
            res.redirect(`/welcome?username=${username}`);
        /*} else {
            res.redirect("/");
        }
        res.end();*/
    })
})


app.post('/getsales', (req, res) => {
    
    const { branch,cashier,dish,from,to} = req.body;
    console.log(branch,cashier,dish,from,to)
    if(dish=='total'){
        const sql = `SELECT SUM(total) as total_sales FROM orders WHERE order_date BETWEEN ? AND ?`;     
        connection.query(sql, [branch, cashier, from, to], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.sendStatus(500);
                return;
            }
            const totalSales = result[0].total_sales;
            res.send(`${totalSales}`);
        });
    }
    else{
        const sql = `SELECT SUM(total) as total_sales FROM orders WHERE (branch_name=? AND cashier_name=? AND dish=? AND order_date BETWEEN ? AND ?)`; 
        connection.query(sql, [branch, cashier, dish, from, to], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.sendStatus(500);
                return;
            }
            const totalSales = result[0].total_sales;
            res.send(`${totalSales}`);
        });
    }
});

app.post('/insert', (req, res) => {
    const { username, customerName, orderNo, orderDate, total,dish,quantity, branchName ,payMode} = req.body;
    console.log(username, customerName, orderNo, orderDate, total,dish,quantity,branchName,payMode)
    const sql = `INSERT INTO orders (cashier_name, customer_name, order_no, order_date,total,dish,quantity,branch_name,pay_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [username, customerName, orderNo, orderDate, total,dish,quantity, branchName, payMode], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.sendStatus(500);
            return;
        }
        console.log('Data inserted');
        res.sendStatus(200);
    });
});

app.post('/delete', (req, res) => {
    const { dish,price, quantity, nam, ono} = req.body;
    console.log('Deleted Values')
    console.log(dish,price,quantity,nam,ono)
    const sql = `delete FROM orders WHERE dish=? AND total=? AND quantity=? AND customer_name=? and order_no=?`;

    connection.query(sql, [dish,price,quantity,nam,ono], (err, result) => {
        if (err) {
            console.error('Error delerting data:', err);
            res.sendStatus(500);
            return;
        }
        console.log('Data deleted');
        res.sendStatus(200);
    });

});



// when login is success
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html")
})

app.get("/sample",function(req,res){
    res.sendFile(__dirname + "/sample.html")
})

// set app port 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});