require('datatables.net-dt')();
getInventoryCategory();
initializeListeners();
populatingInventoryTable();
populatingKitchenTable();
var inventoryData=[];
var inventoryTable;
var kitchenData=[];
var kitchenTable;

//Function For Getting Invenory Categories
function getInventoryCategory() {
    let inventoryCategory = []
    
    //Get Inventory Category from Main Process IPC
    ipc.send('get-inventory-category');
    ipc.once('inventoryCategory', (event, categories) => {
        for (let i = 0; i < categories.length; i++) {
            // converting json to array for datatables
            inventoryCategory.push(categories[i])
            // for employee salary drop down
            $("select#itemCategorySelector").append($("<option>")
                .val(categories[i].inventoryCategoryId)
                .html(categories[i].inventoryCategoryName)
            );

            $("select#newItemCategorySelector").append($("<option>")
                .val(categories[i].inventoryCategoryId)
                .html(categories[i].inventoryCategoryName)
            );
            

            $("select#addItemCategorySelector").append($("<option>")
            .val(categories[i].inventoryCategoryId)
            .html(categories[i].inventoryCategoryName)
        );
        }
       
    })
}




function renderSuggestionsKitchen() {
    autoComplete("customerNameKitchen", allplayers)
}

function renderSuggestionsPlaceOrder() {
    autoComplete("customerNamePlaceOrder", allplayers)
}

function renderSuggestionsCigarette() {
    autoComplete("customerNameCigarettes", allplayers)
}

//Switching Order Type
function openLink(evt, animName,activeTabId) {
    setAllSubTabsToNone();
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
    tabItem(activeTabId);
    evt.currentTarget.className += " w3-white";
}

function setAllSubTabsToNone(){
    var i;
    var x = document.getElementsByClassName("category");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

}

//Selecting Order Action Tab
function tabItem(category) {
    setAllSubTabsToNone();
    document.getElementById(category).style.display = "block";
}
//BUTTONS TAB NAVIGATOR IN MAIN CONTAINER
function buttonTab(evt,closingTab,openingTab,numberOfButtons) {
    var i;
    document.getElementById(closingTab).style.display="none";
    tablinks = document.getElementsByClassName("btnlink");
    for (i = 0; i < numberOfButtons; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-black", "");
    }
    evt.currentTarget.className += " w3-black";
    document.getElementById(openingTab).style.display="block";

   
    // document.getElementById(category).style.display = "block";
}



//Autocomplete Customer Name Field
function autoComplete(input, allplayers) {
    var inp = document.getElementById(input);
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

function kitchenOrder()
{

    var kitchenItem= $("#kitchenOrderItem").val()
    var kitchenPrice= $('#kitchenOrderPrice').val()
    let customerName= $('#customerNameKitchen').val()
    currentPlayerId = getId(customerName)
    if(kitchenItem!=""&&kitchenOrder!=""&&customerName!="")
    {
        if(currentPlayerId!=null)
        {
            ipc.send('add-order-others',null,currentPlayerId,"Kitchen",kitchenItem,kitchenPrice)
            currentPlayerId=null
        }
        else
        {
            ipc.send('error-dialog',"Customer not in database");
        }
    }
    else
    {
        ipc.send('error-dialog',"Empty field(s)");
    }
       
}

function inventoryOrder()
{
    let customerName =  $("#customerNamePlaceOrder").val()
    let selectedItem = $("select#itemSelector").children("option:selected").html();
    let itemPrice=$("select#itemSelector").children("option:selected").val();
    currentPlayerId = getId(customerName)
    let quantity=$("#itemQuantity").val()
    if(selectedItem!=""&& customerName!="")
    {
        if(currentPlayerId!=null)
        {
            ipc.send('add-order',selectedItem,null,currentPlayerId,quantity,itemPrice)
            currentPlayerId=null
        }
        else
        {
            ipc.send('error-dialog',"Customer not in database");
        }
    }
    else
    {
        ipc.send('error-dialog',"Empty field(s)");
    }  
}

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


function addItemToInventory()
{
    //Add to Inventory Code here with IPC
    let newItemName=$("#newItemName").val()
    let newItemPrice=$("#newItemPrice").val()
    let newItemPurchasePrice=$("#newItemPurchasePrice").val()
    let newItemQuantity=$("#newItemQuantity").val()
    let inventoryCategorId=$("select#newItemCategorySelector").children("option:selected").val();
    if(newItemName!=""&&newItemPrice!=""&&newItemQuantity!=""&&newItemPurchasePrice!="")
    {
        ipc.send('add-new-inventory-item', newItemName,newItemPrice,newItemQuantity,inventoryCategorId,newItemPurchasePrice)
    }
}

function addStock()
{
    let itemName=$("select#addItemSelector").children("option:selected").html();
    let quantity=$('#itemStockQuantity').val();
    ipc.send('update-stock',itemName,quantity)
}

function populateSummary()
{
    //populate summary tabs for kitchen, drinks and cigarettes
}

//Initialize Listeners
function initializeListeners()
{
$(document).ready(function () {

    $('#addItemSelector').change(function () {
        $('#currentItemQuantityStock').val("In Stock: "+$("option:selected", this).attr("data-quantity"))
    })
    $('#itemSelector').change(function () {
    $("#itemPrice").val($('#itemSelector').val())
    $('#itemQuantityStock').val("In Stock: "+$("option:selected", this).attr("data-quantity"))
    })
    
   $('#itemCategorySelector').change(function () {
    let selectedValue = $("#itemCategorySelector").val();
    ipc.send('get-inventory',selectedValue);
    ipc.once('Stock',(event,inventory)=>
{
    // Remove previous Select Option
    $('select#itemSelector')
        .find('option')
        .remove()
        .end()
        .append('<option value="text" disabled selected>Select Item</option>');
    
    for(let i=0;i<inventory.length;i++)
    {
        $("#itemSelector").append($("<option>")
        .val(inventory[i].itemAmount)
        .html(inventory[i].itemName)
        .attr('data-quantity',inventory[i].quantity)
        
    );
    console.log(inventory[i].quantity)
    }
})
});
$('#addItemCategorySelector').change(function () {
    let selectedValue = $("#addItemCategorySelector").val();
    ipc.send('get-inventory',selectedValue);
    ipc.once('Stock',(event,inventory)=>
{
    // Remove previous Select Option
    $('select#addItemSelector')
        .find('option')
        .remove()
        .end()
        .append('<option value="text" disabled selected>Select Item</option>');
    
    for(let i=0;i<inventory.length;i++)
    {
        $("#addItemSelector").append($("<option>")
        .val(inventory[i].itemAmount)
        .html(inventory[i].itemName)
        .attr('data-quantity',inventory[i].quantity)
    );
    
    }
})
});
});

}

//Getting Inventory Summary
function populatingInventoryTable()
{
    $(document).ready(function () {
      inventoryTable=$('#inventorySummaryTable').DataTable({
        data: inventoryData,
        "columns": [
            {
                data: "createDate"
            },
            {
                data: "customerName"
            },
            {
                data: "revenueDescription"
            },
            {
                data: "quantity"
            },
            {
                data: "revenueName"
            },
            {
                data: "amount"
            }
    
        ]
    })
    getInventorySummary()
    });
    
}

function getInventorySummary()
{
    ipc.send('get-inventory-data')
    ipc.once('inventory-data',(event,data)=>
  {
    for (let i = 0; i < data.length; i++) {
        // converting json to array for datatables
        inventoryData.push(data[i])

    }
    inventoryTable.clear().rows.add(inventoryData).draw();
    console.log(inventoryData);
  })   
}


//Getting Inventory
function populatingKitchenTable()
{
    $(document).ready(function () {
      kitchenTable=$('#kitchenSummaryTable').DataTable({
        data: kitchenData,
        "columns": [
            {
                data: "createDate"
            },
            {
                data: "customerName"
            },
            {
                data: "revenueDescription"
            },
            {
                data: "revenueName"
            },
            {
                data: "amount"
            }
    
        ]
    })
    getKitchenSummary()
    });
    
}

function getKitchenSummary()
{
    ipc.send('get-kitchen-data')
    ipc.once('kitchen-data',(event,data)=>
  {
    for (let i = 0; i < data.length; i++) {
        // converting json to array for datatables
        kitchenData.push(data[i])

    }
    kitchenTable.clear().rows.add(kitchenData).draw();
    console.log(kitchenData);
  })   
}