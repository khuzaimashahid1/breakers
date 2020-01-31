require('datatables.net-dt')();
var employeeTable,salaryTable,salaryData=[],employeeData=[];
initializeTables();
ipc.once('Reload Employees', (event, message) => {
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


function addEmployee() {
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

// Pay Employee Salary function 
function paySalary() {
    let employeeId = $("select#employeeSelect").children("option:selected").val();
    let salaryMonth = $("select#monthSelect").children("option:selected").html();
    let salaryAmount = $('#salaryAmount').val();
    let salaryNote = $('#salaryNote').val();
    let advanceDeductionAmount = $('#advanceDeductionAmount').val();
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    ipc.send('pay-employee-salary', employeeId, salaryMonth, salaryAmount, salaryNote, advanceDeductionAmount, createDate);


}

// Add Employee Advance function 
function addAdvance() {
    let employeeId = $("select#employeeSelectAdvance").children("option:selected").val();
    let advanceAmount = $('#advanceAmount').val();

    ipc.send('add-employee-advance', employeeId, advanceAmount);
    
    
}

//Function For Getting Employees
function getEmployees() {
    employeeData = []
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
    $('select#employeeSelectSalary')
    .find('option')
    .remove()
    .end()
    .append('<option value="text" disabled selected>Select Employee</option>');
    
    
    //Get Employees from Main Process IPC
    ipc.send('employee');
    ipc.once('employee Data', (event, employees) => {
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
        // for employee advance drop down
        $("select#employeeSelectSalary").append($("<option>")
        .val(employees[i].employeeId)
        .html(employees[i].employeeName)
    );
        }
        
        employeeTable.clear().rows.add(employeeData).draw();

    })
}

//Get Salary History
function getSalaryHistory(employeeId)
{
    
    salaryData=[]
    //Get Salary from Main Process IPC
    ipc.send('get-salary',employeeId);
    ipc.once('salary', (event, salary) => 
    {
        for (let i = 0; i < salary.length; i++) {
            // converting json to array for datatables
            salaryData.push(salary[i])
            
        }
        
        salaryTable.clear().rows.add(salaryData).draw();

    })
}


// Initialize Datatables
function initializeTables() {
    $(document).ready(function () {
        employeeTable=$('#example').DataTable({
            data: employeeData,
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
        salaryTable=$('#salaryHistory').DataTable({
            data: salaryData,
            "columns": [
                {
                    data: "salaryMonth"
                },
                {
                    data: "salaryAmount"
                },
                {
                    data: "createDate"
                }
            ]
        })
        getEmployees();
        

        $("#employeeSelect").change(function () {
            let selectedValue = $("#employeeSelect").val();
            let selectedEmployee = employeeData.filter(employee => (employee.employeeId == selectedValue))
            $("#basicSalary").val(selectedEmployee[0].employeeSalary);
            $("#advanceTaken").val(selectedEmployee[0].employeeAdvance);
        });
        $("#employeeSelectAdvance").change(function () {
            let selectedValue = $("#employeeSelectAdvance").val();
            let selectedEmployee = employeeData.filter(employee => (employee.employeeId == selectedValue))
            $("#advanceTakenAdvance").val(selectedEmployee[0].employeeAdvance);
          });
          $( "#employeeSelectSalary" ).change(function() {
            let selectedValue=$("#employeeSelectSalary").val();
            getSalaryHistory(selectedValue)
          });
    });


}
