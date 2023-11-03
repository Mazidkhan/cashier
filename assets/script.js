var orderCount = 0;

function addDish() {
    const dish = document.getElementById('dish').value;
    const quantity = document.getElementById('quantity').value;
    const dishList = document.getElementById('dishList');
    const li = document.createElement('li');

    let price;

    switch (dish) {
    case 'biryanifull':
        price=140;
        break;
    case 'biryanihalf':
        price=100;
        break;
    case 'rayta':
        price=20;
        break;
    case 'breadhalwa':
        price=20;
        break;
    case 'sujihalwa':
        price=30;
        break;
    case 'gajarhalwa':
        price=60;
        break;
    case 'doodhihalwa':
        price=60;
        break;
    case 'drumsticktwo':
        price=140;
        break;
    case 'drumstickfour':
        price=270;
        break;
    case 'drumstickeight':
        price=520;
        break;
    case 'lollipoptwo':
        price=80;
        break;
    case 'lollipopfour':
        price=270;
        break;
    case 'lollipopeight':
        price=520;
        break;        
    case 'popcorn':
        price=120;
        break;
    case 'wingsix':
        price=120;
        break;
    case 'wingtwelve':
        price=230;
        break;
    case 'panibottle10':
        price=10;
        break;
    case 'panibottle20':
        price=20;
        break;
    case 'thumsup':
        price=20;
        break;
    case 'sprite':
        price=20;
        break;
    case 'cancolddrink':
        price=40;
        break;
    default:
        console.log('Invalid dish selection.');
    }

    const customerName = document.getElementById('customerName').value;
    //const orderNo = document.getElementById('orderNo').value;
    const orderNo = orderCount+1;
    const total = price*quantity;

    li.setAttribute('data-dish', dish);
    li.setAttribute('data-price', total);
    li.setAttribute('data-quantity', quantity);
    li.setAttribute('customer-name', customerName);
    li.setAttribute('order-no', orderNo);

    li.innerHTML = `Dish - ${dish} - Rs.${price} (Quantity: ${quantity}) <button onclick="removeDish(this)">X</button>`;
    dishList.appendChild(li);
    calculateTotalPrice();
    setDefaultDate();

    const branchName=document.getElementById('branchName').value;
    //const cashierName = document.getElementById('cashierName').value;
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username')
    const orderDate = document.getElementById('orderDate').value;
    const payMode=document.getElementById('payMode').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/insert", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ username, customerName, orderNo, orderDate, total,dish,quantity ,branchName,payMode}));
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

     var dish = li.getAttribute('data-dish');
    var price = li.getAttribute('data-price');
    var quantity = li.getAttribute('data-quantity');
    var nam = li.getAttribute('customer-name');
    var ono = li.getAttribute('order-no');

    li.parentNode.removeChild(li);

    calculateTotalPrice();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/delete", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ dish,price, quantity, nam, ono}));    
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

function clearFields() {
    document.getElementById('branchName').value = 'vapi';
    //document.getElementById('cashierName').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('orderDate').value = '';
    document.getElementById('dish').value = 'biryani';
    document.getElementById('dishList').innerHTML = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('totalPrice').value = '';
    document.getElementById('payMode').value = 'cash';
    document.getElementById('pdfDetails').innerHTML = '';
    totalPrice=0;
}


function printPDF() {
    //const cashierName = document.getElementById('cashierName').value;
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username')

    const customerName = document.getElementById('customerName').value;
    var orderNo=document.getElementById('orderNo');
    const dishList = Array.from(document.querySelectorAll('#dishList li')).map(li => li.textContent);
    const p=document.getElementById('totalPrice').value;
    const dat=document.getElementById('orderDate').value;
    const payMode=document.getElementById('payMode').value;    
    var printArea = document.getElementById('printArea');
    orderCount=orderCount+1;
    orderNo.value=orderCount;

    printArea.innerHTML = "<h3>Sufiyana Biryani(The Original Dum Biryani)</h3><br><h4><b>Mob:</b>8160569472</h4><br><br>Order No:"+orderNo.value+"<br>Cashier:"+username+"<br>Customer:" +customerName+"<br>"+dishList+"<br>Date:"+dat+"<br>Total Price:"+p+"<br>Payment Mode: "+payMode +"<br><br><b>ThankYou Visit Again</b>";

    // Capture the HTML content
    var contentToPrint = printArea.innerHTML;

    // Create a temporary hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Set the content of the iframe
    iframe.contentDocument.write(contentToPrint);
    iframe.contentDocument.close();

    // Print the iframe content
    iframe.contentWindow.print();

    // Remove the iframe
    document.body.removeChild(iframe);
}

