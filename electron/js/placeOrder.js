var customerName,drinkStock,cigaretteStock,drinkFilter,cigaretteFilter;
populateStock();

function renderSuggestionsKitchen() {
    autoComplete("customerNameKitchen", allplayers)
}

function renderSuggestionsDrinks() {
    autoComplete("customerNameDrinks", allplayers)
}

function renderSuggestionsCigarette() {
    autoComplete("customerNameCigarettes", allplayers)
}

//Switching Order Type
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

//Selecting Order Action Tab
function tabItem(category) {
    var i;
    var x = document.getElementsByClassName("category");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(category).style.display = "block";
}

//Populate All Stocks
function populateStock() {
    
    //Get Cigarettes from Main Process IPC
    ipc.send('get-cigs');
    ipc.on('Cigarette Stock', (event, cigStock) => 
    {
        cigaretteStock=cigStock
        for (let i = 0; i < cigaretteStock.length; i++) {
            $("select#cigaretteSelectOrder").append($("<option>")
                .val(cigaretteStock[i].inventoryId)
                .html(cigaretteStock[i].itemName)
            );
            $("select#cigaretteSelectStock").append($("<option>")
                .val(cigaretteStock[i].inventoryId)
                .html(cigaretteStock[i].itemName)
            );
        }
        $("select#cigaretteSelectOrder").change(function () {
            var selectedCigarette = $(this).children("option:selected").val();
            cigaretteFilter = cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
            $("#cigarettePriceOrder").val(cigaretteFilter[0].itemAmount)
        });
    })
   
    //Get Drinks from Main Process IPC
    ipc.send('get-drinks');
    ipc.on('Drinks Stock', (event, drinks) => 
    {
        drinkStock=drinks;
        for (let i = 0; i < drinkStock.length; i++) {
            $("select#drinkSelectOrder").append($("<option>")
                .val(drinkStock[i].inventoryId)
                .html(drinkStock[i].itemName)
            );
            $("select#drinkSelectStock").append($("<option>")
                .val(drinkStock[i].inventoryId)
                .html(drinkStock[i].itemName)
            );
        }
        $("select#drinkSelectOrder").change(function () {
            var selectedDrink = $(this).children("option:selected").val();
            drinkFilter = drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
            $("#drinkPriceOrder").val(drinkFilter[0].itemAmount)
        });
    })

}

//Autocomplete Customer Name Field
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

function kitchenOrder()
{

    var kitchenItem= $("#kitchenOrderItem").val()
    var kitchenPrice= $('#kitchenOrderPrice').val()
    customerName= $('#customerNameKitchen').val()
    currentPlayerId = getId(customerName)
    if(kitchenItem!=""&&kitchenOrder!=""&&customerName!="")
    {
        if(currentPlayerId!=null)
        {
            ipc.send('add-order-others',"Walk-In",currentPlayerId,"Kitchen",kitchenItem,kitchenPrice)
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

function drinkOrder()
{
    customerName= $('#customerNameDrinks').val()
    let selectedDrink = $("select#DrinkSelectOrder").children("option:selected").val();
    const drinkFilter=drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
    let inventoryId=drinkFilter[0].inventoryId;
    let price=drinkFilter[0].itemAmount;
    let quantity=1;
    currentPlayerId = getId(customerName)
    if(selectedDrink!="")
    {
        if(currentPlayerId!=null)
        {
            ipc.send('add-order',inventoryId,"Walk-In",currentPlayerId,quantity,price)
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


function cigarettesOrder()
{
    customerName =  $("#cutomerNameCigarettes").val()
    var selectedCigarette = $("select#CigaretteSelectOrder").children("option:selected").val();
    const cigaretteFilter=cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
    let inventoryId=cigaretteFilter[0].inventoryId;
    let price=cigaretteFilter[0].itemAmount;
    currentPlayerId = getId(customerName)
    let quantity=1;
    if(selectedCigarette!=""&& customerName!="")
    {
        if(currentPlayerId!=null)
        {
            ipc.send('add-order',inventoryId,"Walk-In",currentPlayerId,quantity,price)
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

function drinkAddInventory()
{
    newDrinkName = $('#drinkNewName').val();
    newDrinkPrice = $('#drinkNewPrice').val();
    addInventoryItem(newDrinkName,newDrinkPrice);
}

function cigaretteAddInventory()
{
    newCigaretteName = $('#drinkNewName').val();
    newCigarettePrice = $('#drinkNewPrice').val();
    addInventoryItem(newCigaretteName,newCigarettePrice);
}

function addInventoryItem(name, price)
{
    //Add to Inventory Code here with IPC
}

function populateSummary()
{
    //populate summary tabs for kitchen, drinks and cigarettes
}