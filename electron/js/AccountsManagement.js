
require('datatables.net-dt')();

function openLink(evt, animName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-green", "");
    }
    document.getElementById(animName).style.display = "block";
    evt.currentTarget.className += " w3-green";
}

function tabItem(category) {
    var i;
    var x = document.getElementsByClassName("category");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(category).style.display = "block";
}

var data = [];
var revenueData = [{
        Date: "1-06-2020",
        Name: "Single Game",
        Description: "snooker game",
        Amount: "150"
    },
    {
        Date: "1-07-2020",
        Name: "Cigarette",
        Description: "Marlboro",
        Amount: "300"
    },
    {
        Date: "1-08-2020",
        Name: "Double Game",
        Description: "snooker game",
        Amount: "300"
    }

]
for (let i = 0; i < revenueData.length; i++) {
    data.push(revenueData[i])
}

console.log(data)


$(document).ready(function () {
    // Revenue
    $('#Revenue').dataTable({
        data: data,
        "columns": [{
                data: "Date"
            },
            {
                data: "Name"
            },
            {
                data: "Description"
            },
            {
                data: "Amount"
            }
           
        ]
    })

    // Expense
    $('#Expense').dataTable({
        data: data,
        "columns": [{
                data: "Date"
            },
            {
                data: "Name"
            },
            {
                data: "Description"
            },
            {
                data: "Amount"
            }
           
        ]
    })
});


