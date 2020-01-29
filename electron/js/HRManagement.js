require('datatables.net-dt')();
var employeeTable,employeeData=[];
initializeTables();
ipc.on('Reload Employees', (event, message) => {
    getEmployees()
  })

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
    
    ipc.send('add-employee-salary', employeeId, salaryAmount, advanceDeductionAmount,createDate);
    getEmployees();
   
}

// Add Employee Advance function 
function addAdvance()
{
    let employeeId = $("select#employeeSelectAdvance").children("option:selected").val();
    let advanceAmount = $('#advanceAmount').val();
      
    ipc.send('add-employee-advance', employeeId, advanceAmount);
    getEmployees();
    
}

//Function For Getting Employees
function getEmployees(){
    employeeData=[]
    //Remove previous Select Option
    $('select#employeeSelect')
    .find('option')
    .remove()
    .end()
    .append('<option value="text" disabled selected>Select Employee</option>');
    $('select#employeeSelectAdvance')
    .find('option')
    .remove()
    .end()
    .append('<option value="text" disabled selected>Select Employee</option>');
    
    
    //Get Employees from Main Process IPC
    ipc.send('employee');
    ipc.once('employee Data', (event, employees) => 
    {
        for (let i = 0; i < employees.length; i++) {
            // converting json to array for datatables
            employeeData.push(employees[i])
            // for employee salary drop down
            $("select#employeeSelect").append($("<option>")
            .val(employees[i].employeeId)
            .html(employees[i].employeeName)
        );

            // for employee advance drop down
            $("select#employeeSelectAdvance").append($("<option>")
            .val(employees[i].employeeId)
            .html(employees[i].employeeName)
        );
        }
        employeeTable.clear().rows.add(employeeData).draw();

    })
}

// Initialize Datatables
function initializeTables()
{
    $(document).ready(function () {
        console.log("datatables")
    
        employeeTable=$('#example').DataTable({
            data: employeeData,
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
        getEmployees();
    });
    
    
}
