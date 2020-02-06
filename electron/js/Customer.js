if(!customerListener)
{
    var customerListener=ipc.on('Reload',(event, message) => {
      console.log("HEllo from customer")
      getCustomers()
      })  
    
}
//Imports and Declarations
require('datatables.net-dt')();
var creditorTable,customersTable,creditClearTable,creditClearArray=[],creditorsArray=[],customersArray=[];

//Function Calls for intialization
initializeTables();

//Switching Customer Management Type
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


//Fetching Creditors From DB
function getCreditors()
{
  ipc.send('get-creditors');
  ipc.once('creditors',(event,creditors)=>
  {
    for(let i=0;i<creditors.length;i++)
    {
      creditorsArray.push(creditors[i])
    }
    creditorTable.clear().rows.add(creditorsArray).draw();
  })
}

//Fetching Creditors From DB
function getCreditHistory() {
  console.log("in Credit History")
  let customerName = $('#customerCreditName').val();
  let customerId = getId(customerName);
  if (customerId === null) {
    ipc.send('error-dialog', 'Customer Not in Database')
  }
  else {
    creditClearArray = []
    ipc.send('get-credit-history', customerId);
    ipc.once('creditor-history', (event, creditHistory) => {
      for (let i = 0; i < creditHistory.length; i++) {
        creditClearArray.push(creditHistory[i])
      }
      creditClearTable.clear().rows.add(creditClearArray).draw();
    })
  }
}

//Getting Customers
function getCustomers()
{
  customersArray=[]
  allplayers = remote.getGlobal('sharedObj').allplayers;
  for (let i = 0; i < allplayers.length; i++) 
  {
    customersArray.push(allplayers[i])
  }
  customersTable.clear().rows.add(customersArray).draw();
}

//Functions For adding Customer
function addCustomer() {
  let customerName = $('#uname').val();
  let customerAddress = $('#address').val();
  let customerPhone = $('#phone').val();
  const today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  const createDate = yyyy + '-' + mm + '-' + dd;
  ipc.send('add-customer', customerName, customerAddress, customerPhone, createDate)
  clearFields('addCustomer')
}


// Edit record
$('#customersTable').on('click', 'a.editor_edit', function (e) {
  e.preventDefault();

  console.log("editor_edit")

});

// Delete a record
$('#customersTable').on('click', 'a.editor_remove', function (e) {
  e.preventDefault();
  console.log("remove")
  console.log($('#Edit').attr('href'));
  //ipc.send('delete-customer',10)

});


//Initialize DataTables
function initializeTables()
{
  $(document).ready(function () {
    customersTable=$('#customersTable').DataTable({
      scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
      data: customersArray,
      "columns": [
        { data: "customerId" },
        { data: "customerName" },
        { data: "customerAddress" },
        { data: "customerPhone" },
        { data: "createDate" },
        {
          data: null,
          className: "center",
          defaultContent: '<a href="abc" id="Edit" class="editor_edit">Edit</a> / <a href="" class="editor_remove">Delete</a>'
        }
      ]
    })
    creditorTable=$('#creditorsTable').DataTable({
      data: creditorsArray,
      "columns": [{
              data: "customerId"
          },
          {
              data: "customerName"
          },
          {
              data: "creditAmount"
          }
  
      ]
  })
  creditClearTable=$('#creditClear').DataTable({
    data: creditClearArray,
    "columns": [{
            data: "customerName"
        },
        {
            data: "createDate"
        },
        {
            data: "clearingTime"
        },
        {
          data: "amount"
      }

    ]
})
  getCreditors();
  getCustomers();
  });
  
}

function clearCredit()
{
  let customerName= $('#clearCustomer').val();
  let clearAmount=$('#clearAmount').val();
  if(customerName!=''&& clearAmount!='')
  {
    console.log(getId(customerName))
    console.log(clearAmount)
    ipc.send('clear-credit',getId(customerName),clearAmount)
    clearFields('creditClear')
  }
  else
  {
    ipc.send('error-dialog',"Empty field(s)");
  }
}
//CLEAR FIELDS
function clearFields(orderType)
{
    if (orderType =='addCustomer')
        {
           document.getElementById('uname').value ='';
           document.getElementById('address').value ='';
           document.getElementById('phone').value ='';
           
        }
        else if (orderType =='creditClear')
        {
           document.getElementById('clearCustomer').value ='';
           document.getElementById('clearAmount').value ='';
           
        }
}
//Get Customer Id from name
function getId(name)
{
    for(var i=0; i<allplayers.length;i++)
    {
        if(allplayers[i].customerName===name)
        {
            return allplayers[i].customerId
        }
    }
    return null;
}

//Render Suggestion for autocompletion
function renderSuggestions()
{
  autoComplete("clearCustomer", allplayers)
}

//Render Suggestion for autocompletion credit summary
function renderSuggestionsSummary()
{
  autoComplete("customerCreditName", allplayers)
}

//Autosuggest for Credit Clear
function autoComplete(input, allplayers) {
  var inp = document.getElementById(input);
  console.log(inp)
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
      var listContainerDiv, elementContainerDiv, i;
      var val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      listContainerDiv = document.createElement("DIV");
      listContainerDiv.setAttribute("id", this.id + "autocomplete-list");
      listContainerDiv.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(listContainerDiv);
      /*for each item in the array...*/
      for (i = 0; i < allplayers.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (allplayers[i].customerName.substr(0, val.length).toLowerCase() == val.toLowerCase()) {
              /*create a DIV element for each matching element:*/
              elementContainerDiv = document.createElement("DIV");
              /*make the matching letters bold:*/
              elementContainerDiv.innerHTML = "<strong>" + allplayers[i].customerName.substr(0, val.length) + "</strong>";
              elementContainerDiv.innerHTML += allplayers[i].customerName.substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              elementContainerDiv.innerHTML += "<input type='hidden' value='" + allplayers[i].customerName + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              elementContainerDiv.addEventListener("click", function (e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              listContainerDiv.appendChild(elementContainerDiv);
          }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
      } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
      } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
          }
      }
  });
  function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
      }
  }
  function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
          }
      }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}


