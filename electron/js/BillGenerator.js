// window.$ = window.jQuery = require('jquery');
require('datatables.net-dt')();


var data = [];
var jsonData = [{
        item: "Single Game",
        time_quantity: "2",
        price: "300"
    },
    {
        item: "Malbro",
        time_quantity: "3",
        price: "500"
    },
    {
        item: "Zinger Burder",
        time_quantity: "1",
        price: "350"

    }



]
for (let i = 0; i < jsonData.length; i++) {
    data.push(jsonData[i])
}

console.log(data)



$(document).ready(function () {
    $('#example').dataTable({
        data: data,
        "columns": [{
                data: "item"
            },
            {
                data: "time_quantity"
            },
            {
                data: "price"
            }

        ]
    })
});