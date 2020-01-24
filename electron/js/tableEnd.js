const { remote } = require('electron');
const electron = require('electron');
const connections=require('../DataBaseOperations/connections.js')
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')
const players = remote.getGlobal('sharedObj').currentPlayers;
window.$ = window.jQuery = require('jquery');
let tableNumber = remote.getGlobal('sharedObj').tableNumber
let currentGame = remote.getGlobal('sharedObj').games[tableNumber - 1];
let cigaretteStock,drinkStock;
let currentPlayerId;
let currentPlayers = []

getCurrentPlayers();
populatePlayers();
populateStock();
console.log(players)
console.log(currentPlayers)
//Function For Getting Current Players
function getCurrentPlayers() {
    Object.values(currentGame).forEach(function (value, index) {
        // const playerDiv = document.getElementById("divPlayer"+counter);
        // const playerField = document.getElementById("player"+counter);
        if (index > 5 && index < 16) {
            if (value !== null) {
                const player = players.filter((player => (player.customerId === (value))));
                currentPlayers.push(player[0]);
                // playerField.innerText=player[0].customerName;
            }
            else {
                // playerDiv.style.display = "none";
                currentPlayers.push(null)
            }
        }
    });
}

//Render Modal
function modalScript(playerId) {
    currentPlayerId=playerId;
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

//Render Different Modal Tabs
function tabItem(category) {
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(category).style.display = "block";
}


//Populate Game Info
function populatePlayers() {
    var numberofCurrnetPlayers = currentPlayers.length;
    $(".header").append(
        '<div class="headerItem">' +
        '<label>Table No. : ' + tableNumber + '</label>' +
        '</div>' +
        '<div class="headerItem">' +
        '<label>Game Type: ' + currentGame.gameType + ' </label>' +
        '</div>' +
        '<div class="headerItem">' +
        '<label>Start Time: ' + currentGame.startTime + '</label>' +
        '</div>'
    );

    for (i = 0; i < numberofCurrnetPlayers; i++) {
        if (currentPlayers[i] != null) {
            $(".grid-container").append(' <div class="grid-item">' +
                '<div id="' + currentPlayers[i].customerId + '"class="playerTitle">' +
                '<label class="player">' + currentPlayers[i].customerName + '</label>' +
                '</div>' +
                '<div class="hoverBody">' +
                '<button id="btnAddExtra" class="btnAddExtra"  onClick="modalScript('+currentPlayers[i].customerId+')">Add Extra</button>' +
                '</div>' +
                '</div>');
            $(".playersList").append("<option id=" + currentPlayers[i].customerId + ">" + currentPlayers[i].customerName + "</option");
        }
    }

}

//Populate Stock Items
function populateStock()
{
    connections.getCigarettes().then(rows=>
        {   
            cigaretteStock =rows;
            for(let i=0;i<cigaretteStock.length;i++)
            {
                $("select#CigaretteSelect").append( $("<option>")
                .val(cigaretteStock[i].inventoryId)
                .html(cigaretteStock[i].itemName)
                );
            }
            $("select#CigaretteSelect").change(function(){
                var selectedCigarette = $(this).children("option:selected").val();
                const cigaretteFilter=cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
                $("#cigarettePrice").val(cigaretteFilter[0].itemAmount)
            });
        });

        connections.getDrinks().then(rows=>
            {   
                drinkStock =rows;
                for(let i=0;i<drinkStock.length;i++)
                {
                    $("select#DrinkSelect").append( $("<option>")
                    .val(drinkStock[i].inventoryId)
                    .html(drinkStock[i].itemName)
                    );
                }
                $("select#DrinkSelect").change(function(){
                    var selectedDrink = $(this).children("option:selected").val();
                    const drinkFilter=drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
                    $("#drinkPrice").val(drinkFilter[0].itemAmount)
                });
            });
    
}

//Drinks Order
function drinksOrder()
{
    let selectedDrink = $("select#DrinkSelect").children("option:selected").val();
    const drinkFilter=drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
    let inventoryId=drinkFilter[0].inventoryId;
    let price=drinkFilter[0].itemAmount;
    let gameId=currentGame.gameId;
    let quantity=1;
    ipc.send('add-order',inventoryId,gameId,currentPlayerId,quantity,price)
       
}

//Cigarettes Order
function cigarettesOrder()
{
    var selectedCigarette = $("select#CigaretteSelect").children("option:selected").val();
    const cigaretteFilter=cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
    let inventoryId=cigaretteFilter[0].inventoryId;
    let price=cigaretteFilter[0].itemAmount;
    let gameId=currentGame.gameId;
    let quantity=1;
    ipc.send('add-order',inventoryId,gameId,currentPlayerId,quantity,price)
       
}

//Kitchen Order
function kitchenOrder()
{
    let kitchenItem=$("#kitchenItem").val();
    let kitchenPrice=$("#kitchenPrice").val();
    let gameId=currentGame.gameId;
    ipc.send('add-order-others',gameId,currentPlayerId,"Kitchen",kitchenItem,kitchenPrice)
       
}

//Kitchen Order
function miscOrder()
{
    let miscItem=$("#miscItem").val();
    let miscPrice=$("#miscPrice").val();
    let gameId=currentGame.gameId;
    ipc.send('add-order-others',gameId,currentPlayerId,"Misc",miscItem,miscPrice)
       
}

//End Game (Iron Man Dies)
function endGame()
{
    if(currentGame.gameType==="single"||currentGame.gameType==="century")
    {
        var loser = $("select#loserSelect").children("option:selected").val();
        console.log(loser)
        const player=currentPlayers.filter(player => (player!=null && player.customerName == loser));
            if(player.length<1)
            {
                ipc.send('error-dialog',"Please Select a Loser");
                return;
            }
            else
            {
                let gameId=currentGame.gameId;
                let loserId1=player[0].customerId;
                ipc.send('end-game',gameId,loserId1,null)
                remote.getCurrentWindow().close()
            }
    }
}


