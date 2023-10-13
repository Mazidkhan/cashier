let orderCount = 1;

function addDish() {
    const dish = document.getElementById('dish').value;
    const quantity = document.getElementById('quantity').value;
    const dishList = document.getElementById('dishList');
    const li = document.createElement('li');

    let price;

    switch (dish) {
    case 'biryani':
        price=140;
        break;
    case 'rayta':
        price=20;
        break;
    case 'breadhalwa':
        price=20;
        break;
    case 'sujihalwa':
        price=20;
        break;
    case 'drumstick':
        price=150;
        break;
    case 'lollipop':
        price=200;
        break;
    case 'popcorn':
        price=150;
        break;
    case 'wing':
        price=150;
        break;
    default:
        console.log('Invalid dish selection.');
    }


    li.innerHTML = `${dish} - Rs.${price} (Quantity: ${quantity}) <button onclick="removeDish(this)">X</button>`;
    dishList.appendChild(li);
    calculateTotalPrice();
    updateOrderNo();
    setDefaultDate();

    const branchName=document.getElementById('branchName').value;
    const cashierName = document.getElementById('cashierName').value;
    const customerName = document.getElementById('customerName').value;
    const orderNo = document.getElementById('orderNo').value;
    const orderDate = document.getElementById('orderDate').value;
    const total = quantity*price;
    const payMode=document.getElementById('payMode').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/insert", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ cashierName, customerName, orderNo, orderDate, total,dish,quantity ,branchName,payMode}));

}


function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('orderDate').value = formattedDate;
}
function removeDish(btn) {
    const li = btn.parentNode;
    console.log(li)
    li.parentNode.removeChild(li);
    calculateTotalPrice();
}
function updateOrderNo() {
    document.getElementById('orderNo').value = orderCount;
}
function calculateTotalPrice() {
    const dishPrices = Array.from(document.querySelectorAll('#dishList li')).map(li => {
        const price = parseFloat(li.textContent.match(/\d+/));
        const quantity = parseInt(li.textContent.match(/Quantity: (\d+)/)[1]);
        return price * quantity;
    });
    const totalPrice = dishPrices.reduce((acc, price) => acc + price, 0);
    document.getElementById('totalPrice').value = `${totalPrice}`;
}
function generatePDF() {
    const cashierName = document.getElementById('cashierName').value;
    const customerName = document.getElementById('customerName').value;
    const orderNo = orderCount++;
    const dishList = Array.from(document.querySelectorAll('#dishList li')).map(li => li.textContent);
    const p=document.getElementById('totalPrice').value;
    const dat=document.getElementById('orderDate').value;
    const payMode=document.getElementById('payMode').value;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:4000/generate-pdf?cashierName=${cashierName}&customerName=${customerName}&orderNo=${orderNo}&dishList=${JSON.stringify(dishList)}&date=${dat}&payMode=${payMode}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('PDF generated successfully');

            // Show pop-up with PDF details
            const pdfDetails = `Order No: ${orderNo}<br>Cashier: ${cashierName}<br>Customer: ${customerName}<br>Dishes: ${dishList}<br>Date:${dat}<br>Total Price: ${p}<br>Payment Mode: ${payMode}`;
            document.getElementById('pdfDetails').innerHTML = pdfDetails;
            document.getElementById('pdfPopup').style.display = 'block';
        } else {
            console.error('Error generating PDF');
        }
    };
    xhr.send();
}

function printPDF() {
    var pdfContent = document.getElementById('pdfDetails').innerHTML;
    var newWindow = window.open('', '_blank');
    newWindow.document.open();
    newWindow.document.write('<html><head><title>Print</title></head><body><h1>Bombay A1 Caterers</h1>' + pdfContent + '</body></html>');
    newWindow.document.close();
    newWindow.print();
}

function closePopup() {
    document.getElementById('pdfPopup').style.display = 'none';
}
