// const { remote } = require('electron');
// const electron = require('electron');
// var ipc = electron.ipcRenderer;
// var win = remote.getGlobal('win')
var players = remote.getGlobal('sharedObj').allplayers;
// window.$ = window.jQuery = require('jquery');
// var tableNumber = remote.getGlobal('sharedObj').tableNumber
// var centuryPlayersCount = 1;
// var centuryMaxPlayers = 10;
const connections = require('../DataBaseOperations/connections.js')
// var currentGame = remote.getGlobal('sharedObj').games[tableNumber - 1];
// var cigaretteStock, drinkStock;
// var currentPlayerId;
// var currentPlayers = []


populateStock();

function renderSuggestions() {
    console.log("Working")
    autoComplete("customerNameKitchen", players)
    autoComplete("customerNameDrink", players)
    autoComplete("customerNameCigarette", players)
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
        tablinks[i].className = tablinks[i].className.replace(" w3-green", "");
    }
    document.getElementById(animName).style.display = "block";
    evt.currentTarget.className += " w3-green";
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

//Populating Drinks and Cigarette Stock
function populateStock() {
    connections.getCigarettes().then(rows => {
        cigaretteStock = rows;
        for (var i = 0; i < cigaretteStock.length; i++) {
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
            const cigaretteFilter = cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
            $("#cigarettePriceOrder").val(cigaretteFilter[0].itemAmount)
        });
    });

    connections.getDrinks().then(rows => {
        drinkStock = rows;
        for (var i = 0; i < drinkStock.length; i++) {
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
            const drinkFilter = drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
            $("#drinkPriceOrder").val(drinkFilter[0].itemAmount)
        });
    });

}

//Autocomplete Customer Name Field
function autoComplete(input, players) {
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
        for (i = 0; i < players.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (players[i].customerName.substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                /*create a DIV element for each matching element:*/
                elementContainerDiv = document.createElement("DIV");
                /*make the matching letters bold:*/
                elementContainerDiv.innerHTML = "<strong>" + players[i].customerName.substr(0, val.length) + "</strong>";
                elementContainerDiv.innerHTML += players[i].customerName.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                elementContainerDiv.innerHTML += "<input type='hidden' value='" + players[i].customerName + "'>";
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
    var customerName= $('#customerNameKitchen').val()
    // console.log(players)
    getId(customerName)
    // ipc.send('add-order-others',"Walk-In",currentPlayerId,"Kitchen",kitchenItem,kitchenPrice)
       
}

function getId(name)
{
    for(var i=0; i<players.length;i++)
    {
        if(players.customerName[i]===name)
        {
            console.log(players)
        }
    }
}
