require('datatables.net-dt')();

function openLink(evt, animName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-white", "");
    }
    document.getElementById(animName).style.display = "block";
    evt.currentTarget.className += " w3-white";
}


function addEmployee()
{

}

function addSalary()
{
    
}

function addAdvance()
{
    
}

var data = [];
var jsonData = [{
        FirstName: "1-06-2020",
        LastName: "2000",
        Post: "200",
        Phone: "5600",
        Address: "24000",
        BasicPay: "22000",
        Advance: "250"
    },
    {
      FirstName: "1-06-2020",
      LastName: "2000",
      Post: "200",
      Phone: "5600",
      Address: "24000",
      BasicPay: "22000",
      Advance: "250"
    },
    {
      FirstName: "1-06-2020",
      LastName: "2000",
      Post: "200",
      Phone: "5600",
      Address: "24000",
      BasicPay: "22000",
      Advance: "250"

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
                data: "FirstName"
            },
            {
                data: "LastName"
            },
            {
                data: "Post"
            },
            {
                data: "Phone"
            },
            {
                data: "Address"
            },
            {
                data: "BasicPay"
            },
            {
                data: "Advance"
            }
        ]
    })
});