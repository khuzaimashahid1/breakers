
require('datatables.net-dt')();
var data = [];
var jsonData = 
[
    {
        Date: "1-06-2020",
        Kitchen: "2000",
        Drinks: "2000",
        Cigarettes: "5600",
        Tables: "5600",
        Credit_Clear: "200",
        Grand_Total: "24000",
        Net_Total: "22000",
    },
    {
        Date: "1-06-2020",
        Kitchen: "2000",
        Drinks: "2000",
        Cigarettes: "5600",
        Tables: "5600",
        Credit_Clear: "200",
        Grand_Total: "24000",
        Net_Total: "22000",
    },
    {
        Date: "1-06-2020",
        Kitchen: "2000",
        Drinks: "2000",
        Cigarettes: "5600",
        Tables: "5600",
        Credit_Clear: "200",
        Grand_Total: "24000",
        Net_Total: "22000",
    }
]
for (let i = 0; i < jsonData.length; i++) {
    data.push(jsonData[i])
}

console.log(data)



$(document).ready(function () {
    $('#example').dataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
        data: data,
        "columns": [{
                data: "Date"
            },
            {
                data: "Kitchen"
            },
            {
                data: "Drinks"
            },
            {
                data: "Cigarettes"
            },
            {
                data: "Tables"
            },
            {
                data: "Credit_Clear"
            },
            {
                data: "Grand_Total"
            },
            {
                data: "Net_Total"
            }
        ]
    })
});