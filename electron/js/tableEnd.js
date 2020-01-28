const { remote } = require('electron');
const electron = require('electron');
let ipc = electron.ipcRenderer;
const players = remote.getGlobal('sharedObj').currentPlayers;
window.$ = window.jQuery = require('jquery');
let tableNumber = remote.getGlobal('sharedObj').tableNumber
let currentGame = remote.getGlobal('sharedObj').games[tableNumber - 1];
let currentPlayerId;
let currentPlayers = []
let drinkStock,cigaretteStock;
getCurrentPlayers();
populatePlayers();
populateStock();
console.log(players)
console.log(currentPlayers)
//Function For Getting Current Players
function getCurrentPlayers() {
    Object.values(currentGame).forEach(function (value, index) {
        if (index > 5 && index < 16) {
            if (value !== null) {
                const player = players.filter((player => (player.customerId === (value))));
                currentPlayers.push(player[0]);
                console.log(player[0])
            }
            else {
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
    let team=1;
    for (i = 0; i < numberofCurrnetPlayers; i++) {
        if (currentPlayers[i] !== null) {
            $(".grid-container").append(' <div class="grid-item">' +
                '<div id="' + currentPlayers[i].customerId + '"class="playerTitle">' +
                '<label class="player">' + currentPlayers[i].customerName + '</label>' +
                '</div>' +
                '<div class="hoverBody">' +
                '<button id="btnAddExtra" class="btnAddExtra"  onClick="modalScript('+currentPlayers[i].customerId+')">Add Extra</button>' +
                '</div>' +
                '</div>');
            if(currentGame.gameType==="Double")
            {
                if(i==0 || i ==2)
                {
                    $(".playersList").append("<option id=" + currentPlayers[i].customerId +","+currentPlayers[i+1].customerId + ">" + "Team "+team+ " ( "+currentPlayers[i].customerName +" and "+currentPlayers[i+1].customerName+")"+ "</option");
                    team++;
                }
                
            }
            else
            {
                $(".playersList").append("<option id=" + currentPlayers[i].customerId + ">" + currentPlayers[i].customerName + "</option");
            }
                
        }
    }

}

//Populate All Stocks
function populateStock() {
    
    //Get Cigarettes from Main Process IPC
    ipc.send('get-cigs');
    ipc.on('Cigarette Stock', (event, cigStock) => 
    {
        cigaretteStock = cigStock
        for (let i = 0; i < cigaretteStock.length; i++) {
            $("select#CigaretteSelect").append($("<option>")
                .val(cigaretteStock[i].inventoryId)
                .html(cigaretteStock[i].itemName)
            );
        }
        $("select#CigaretteSelect").change(function () {
            var selectedCigarette = $(this).children("option:selected").val();
            const cigaretteFilter = cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
            $("#CigarettePrice").val(cigaretteFilter[0].itemAmount)
        });
    })
   
    //Get Drinks from Main Process IPC
    ipc.send('get-drinks');
    ipc.on('Drinks Stock', (event, drinks) => 
    {
        drinkStock = drinks;
        for (let i = 0; i < drinkStock.length; i++) {
            $("select#DrinkSelect").append($("<option>")
                .val(drinkStock[i].inventoryId)
                .html(drinkStock[i].itemName)
            );
        }
        $("select#DrinkSelect").change(function () {
            var selectedDrink = $(this).children("option:selected").val();
            const drinkFilter = drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
            $("#DrinkPrice").val(drinkFilter[0].itemAmount)
        });
    })

}


//Drinks Order
function drinksOrder()
{
    let selectedDrink = $("select#DrinkSelect").children("option:selected").val();
    const drinkFilter=drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
    let inventoryId=drinkFilter[0].inventoryId;
    let price=drinkFilter[0].itemAmount;
    let gameId=currentGame.gameId;
    let quantity=$("#DrinkQuantity").val()
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
    let quantity=$("#CigaretteQuantity").val()
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
    if(currentGame.gameType==="Single" || currentGame.gameType==="Century")
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
                ipc.send('end-game',gameId,100,loserId1,null)
                remote.getCurrentWindow().close()
            }
    }
    else
    {
        var loser = $("select#loserSelect").children("option:selected").attr('id');
        loser = loser.split(",");
        let gameId=currentGame.gameId;
        ipc.send('end-game',gameId,100,parseInt(loser[0]),parseInt(loser[1]))
        remote.getCurrentWindow().close()

    }
}

function nextGame()
{
    const status="ongoing";
    const today = new Date();
    const startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    let playersArray=[]
    for(let i =0;i<currentPlayers.length;i++)
    {
        if(currentPlayers[i]!==null)
        {
            playersArray.push(currentPlayers[i].customerId)
        }
        else
        {
            playersArray.push(null)
        }
        
    }
    ipc.send('start-game',tableNumber,status,currentGame.gameType,...playersArray,startTime,createDate)
    endGame();
}


