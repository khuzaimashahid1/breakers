
require('datatables.net-dt')();
var data = [];
var jsonData = [{
        Date: "1-06-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"
    },
    {
        Date: "1-07-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"
    },
    {
        Date: "1-08-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"

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
                data: "Date"
            },
            {
                data: "Drinks"
            },
            {
                data: "Credit_Clear"
            },
            {
                data: "Cigarette"
            },
            {
                data: "Grand_Total"
            },
            {
                data: "Net_Total"
            },
            {
                data: "Over"
            },
            {
                data: "Cash"
            }
        ]
    })
});