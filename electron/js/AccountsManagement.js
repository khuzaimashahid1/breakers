require('datatables.net-dt')();

var expenseTable,expenseArray=[];

//Function Calls for intialization
initializeTables();
getExpenseCategory();

ipc.once('Reload', (event, message) => {
    getCustomers();
    getExpenseCategory();
  })

  
//Fetching Expense From DB
function getExpense()
{

  ipc.send('get-expense');
  ipc.once('expense',(event,expense)=>
  {
    for(let i=0;i<expense.length;i++)
    {
        expenseArray.push(expense[i])
    }
    expenseTable.clear().rows.add(expenseArray).draw();
    console.log(expenseArray);
  })
}

//Fetching Expense From DB
function getExpenseCategory()
{

    //Remove previous Select Option
    $('select#expenseCategory')
    .find('option')
    .remove()
    .end()
    .append('<option value="text" disabled selected>Select Expense Catergory</option>');

  ipc.send('get-expense-category');
  ipc.once('expenseCategory',(event,expenseCategory)=>
  {
    for(let i=0;i<expenseCategory.length;i++)
    {
        // for expense category drop down
        $("select#expenseCategory").append($("<option>")
        .val(expenseCategory[i].expenseCategoryId)
        .html(expenseCategory[i].expenseCategoryName)
        );
    }
    console.log(expenseCategory);
  })
}


function openModal()
{
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () 
    {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
      }
    }
}

function addExpense()
{
    let expenseName = $('#expenseName').val();
    let expenseDescription = $('#expenseDescription').val();
    let expenseAmount = $('#expenseAmount').val();
    let expenseCategoryId = $("select#expenseCategory").children("option:selected").val();

    console.log(expenseName+expenseDescription+expenseAmount)
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;

    if(expenseName!=''&&expenseAmount)
    {
        ipc.send('add-expense', expenseName,expenseDescription,expenseAmount,createDate,expenseCategoryId)
    }
    else
    {
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

//Initialize DataTables
function initializeTables()
{
$(document).ready(function () {

    

    // Revenue
    $('#Revenue').DataTable({
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
    expenseTable=$('#Expense').DataTable({
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

});

}
