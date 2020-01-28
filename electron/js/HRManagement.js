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
    let employeeName = $('#employeeName').val();
    let employeeDesignation = $('#employeeDesignation').val();
    let employeeCNIC = $('#employeeCNIC').val();
    let employeeAddress = $('#employeeAddress').val();
    let employeePhone = $('#employeePhone').val();
    let employeeBasicPay = $('#employeeBasicPay').val();

    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    
    ipc.send('add-employee', employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeBasicPay, createDate);
    getEmployees();
    startup();
    // win.reload();
    // var newUrl = "HRManagement.html";
    // win.location.href = newUrl;

}

// Add Employee Salary function 
function addSalary()
{
    let employeeId = $("select#employeeSelect").children("option:selected").val();
    let salaryAmount = $('#salaryAmount').val();
    let advanceDeductionAmount = $('#advanceDeductionAmount').val();

    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    
    ipc.send('add-salary', employeeId, salaryAmount, advanceDeductionAmount,createDate);
    getEmployees();
    startup();
}

// Add Employee Advance function 
function addAdvance()
{
    let employeeId = $("select#employeeSelectAdvance").children("option:selected").val();
    let advanceAmount = $('#advanceAmount').val();
    
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    
    ipc.send('add-salary', employeeId, advanceAmount, createDate);
    getEmployees();
    startup();
}

var data = [];
var jsonData;

function getEmployees(){
    //Get Employees from Main Process IPC
    ipc.send('employee');
    ipc.once('employee Data', (event, employeeData) => 
    {
         jsonData=employeeData;

        console.log(jsonData)
        for (let i = 0; i < jsonData.length; i++) {
            // converting json to array for datatables
            data.push(jsonData[i])
            
            // for employee salary drop down
            $("select#employeeSelect").append($("<option>")
            .val(jsonData[i].emmployeeId)
            .html(jsonData[i].employeeName)
        );

            // for employee advance drop down
            $("select#employeeSelectAdvance").append($("<option>")
            .val(jsonData[i].emmployeeId)
            .html(jsonData[i].employeeName)
        );

        }

    })
}


getEmployees();

console.log(data)



// $(document).ready(function () {
function startup() {
    console.log("datatables")

    $('#example').dataTable({
        data: data,
        retrieve: true,
        "columns": [{
                data: "employeeName"
            },
            {
                data: "employeeDesignation"
            },
            {
                data: "employeePhone"
            },
            {
                data: "employeeAddress"
            },
            {
                data: "employeeCNIC"
            },
            {
                data: "employeeSalary"
            },
            {
                data: "employeeAdvance"
            }
        ]
    })
}

$(document).ready(startup);
// });

