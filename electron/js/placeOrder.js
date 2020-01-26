// var { remote } = require('electron');
// var electron = require('electron');
var connections=require('../DataBaseOperations/connections.js')
// var ipc = electron.ipcRenderer;
// var win = remote.getGlobal('win')
// var players = remote.getGlobal('sharedObj').currentPlayers;
// window.$ = window.jQuery = require('jquery');
// var tableNumber = remote.getGlobal('sharedObj').tableNumber
// var currentGame = remote.getGlobal('sharedObj').games[tableNumber - 1];
// var cigaretteStock,drinkStock;
// var currentPlayerId;
// var currentPlayers = []

populateStock();

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

function tabItem(category) {
    var i;
    var x = document.getElementsByClassName("category");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(category).style.display = "block";
}


function populateStock() {
    connections.getCigarettes().then(rows => {
        cigaretteStock = rows;
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
            const cigaretteFilter = cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
            $("#cigarettePriceOrder").val(cigaretteFilter[0].itemAmount)
        });
    });

    connections.getDrinks().then(rows => {
        drinkStock = rows;
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
            const drinkFilter = drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
            $("#drinkPriceOrder").val(drinkFilter[0].itemAmount)
        });
    });

}
