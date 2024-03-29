require('datatables.net-dt')();

var expenseTable, revenueTable, expenseArray = [], revenueArray = [];

//Function Calls for intialization
initializeTables();
getExpenseCategory();

ipc.once('Reload Expense', (event, message) => {
    getExpense();
    getExpenseCategory();
    getRevenue();
})

//Fetching Expense From DB
function getExpense() {

    ipc.send('get-expense');
    ipc.once('expense', (event, expense) => {
        for (let i = 0; i < expense.length; i++) {
            expenseArray.push(expense[i])
        }
        expenseTable.clear().rows.add(expenseArray).draw();
    })
}
//CLEAR FIELDS
function clearFields(orderType)
{
    if (orderType =='addExpense')
        {
           document.getElementById('expenseName').value ='';
           document.getElementById('expenseCategory').selectedIndex ='0';
           document.getElementById('expenseDescription').value ='';
           document.getElementById('expenseAmount').value ='';
           
        }
        
}


//Fetching Expense From DB
function getExpenseCategory() {

    //Remove previous Select Option
    $('select#expenseCategory')
        .find('option')
        .remove()
        .end()
        .append('<option value="text" disabled selected>Select Expense Catergory</option>');

    ipc.send('get-expense-category');
    ipc.once('expenseCategory', (event, expenseCategory) => {
        for (let i = 0; i < expenseCategory.length; i++) {
            // for expense category drop down
            $("select#expenseCategory").append($("<option>")
                .val(expenseCategory[i].expenseCategoryId)
                .html(expenseCategory[i].expenseCategoryName)
            );
        }
    })
}


//Fetching Revenue From DB
function getRevenue() {

    ipc.send('get-revenue');
    ipc.once('revenue', (event, revenue) => {
        for (let i = 0; i < revenue.length; i++) {
            revenueArray.push(revenue[i])
        }
        revenueTable.clear().rows.add(revenueArray).draw();
    })
}

function openModal() {
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function addExpense() {
    let expenseName = $('#expenseName').val();
    let expenseAmount = $('#expenseAmount').val();
    let expenseDescription= $('#expenseDescription').val();
    let expenseCategoryId = $("select#expenseCategory").children("option:selected").val();

    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;

    if (expenseName != '' && expenseAmount!='') 
    {
        ipc.send('add-expense', expenseName,expenseDescription,expenseAmount,createDate,expenseCategoryId)
        clearFields('addExpense')
    }
    else {
        ipc.send('error-dialog', "Empty Field(s)")
    }
}



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

    if(animName == "Fade"){
        var tableExpense = $('#Expense').DataTable();
        $('#Fade').css( 'display', 'block' );
          tableExpense.columns.adjust().draw(); 
    }
    else if(animName == "Left"){
        var tableRevenue = $('#Revenue').DataTable();
        $('#Left').css( 'display', 'block' );
          tableRevenue.columns.adjust().draw();  
    }



}

function tabItem(category) {
    var i;
    var x = document.getElementsByClassName("category");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(category).style.display = "block";
}


//Initialize DataTables
function initializeTables()
{
$(document).ready(function () {

    
    // Revenue DataTable
    revenueTable=$('#Revenue').DataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
        data: revenueArray,
        "columns": [
            {
                data: "revenueName"
            },
            {
                data: "revenueCategory"
            },
            {
                data: "revenueDescription"
            },
            {
                data: "revenueAmount"
            },
            {
                data: "createDate"
            }
           
        ]
    })

    // Expense DataTable
    expenseTable=$('#Expense').DataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
        data: expenseArray,
        "columns": [

            {
                data: "expenseName"
            },
            {
                data: "expenseCategory"
            },
            {
                data: "expenseDescription"
            },
            {
                data: "expenseAmount"
            },
            {
                data: "createDate"
            }
           
        ]
    })

    getExpense();
    getRevenue();

});

}
