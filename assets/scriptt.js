document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const tableData = document.getElementById('table-data');
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.cashier_name}</td><td>${row.customer_name}</td><td>${row.order_no}</td><td>${row.order_date}</td><td>${row.total}</td><td>${row.dish}</td><td>${row.quantity}</td><td>${row.branch_name}</td>`; // Add more columns as needed
                tableData.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    // Attach event listeners to filters
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('input', (event) => {
            filterInputs[event.target.id] = event.target.value;
        });
    });

    // Attach event listener to calculate button
    document.getElementById('calculateButton').addEventListener('click', fetchData);

    // Initial data fetch
    fetchData();

});

function getSales(){
    const branch = document.getElementById('branch').value;
    const cashier = document.getElementById('cashier').value;
    const dish = document.getElementById('dish').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/getsales", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const totalSales = xhr.responseText;
                document.getElementById('totalSales').innerText = `Total Sales: ${totalSales}`;
                document.querySelector('.popup').classList.add('active');
                document.querySelector('.overlay').classList.add('active');

                document.querySelector('.overlay').addEventListener('click', function() {
                document.querySelector('.popup').classList.remove('active');
                document.querySelector('.overlay').classList.remove('active');
                });
                document.querySelector('.closeButton').addEventListener('click', function() {
                document.querySelector('.popup').classList.remove('active');
                document.querySelector('.overlay').classList.remove('active');
                });
            } else {
                alert('Error getting total sales');
            }
        }
    };
    xhr.send(JSON.stringify({ branch,cashier,dish,from,to}));  
}

function getData(){
    window.location.href = 'data.html';
}