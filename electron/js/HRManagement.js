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
var jsonData;

for (let i = 0; i < jsonData.length; i++) {
    data.push(jsonData[i])
}

console.log(data)

$(document).ready(function () {
    $('#example').dataTable({
        data: data,
        "columns": [{
                data: "EmployeeName"
            },
            {
                data: "EmployeeDesignation"
            },
            {
                data: "EmployeePhone"
            },
            {
                data: "EmployeeAddress"
            },
            {
                data: "EmployeeSalary"
            },
            {
                data: "Advance"
            }
        ]
    })
});

$(document).ready(function () {
      //Get Cigarettes from Main Process IPC
      ipc.send('employee');
      ipc.on('employee Data', (event, employeeData) => 
      {
           jsonData=employeeData;
      })
});