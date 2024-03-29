const { remote } = require('electron');
const electron = require('electron');
let ipc = electron.ipcRenderer;
const players = remote.getGlobal('sharedObj').currentPlayers;
window.$ = window.jQuery = require('jquery');
require('datatables.net-dt')();
let tableNumber = remote.getGlobal('sharedObj').tableNumber
let currentGame = remote.getGlobal('sharedObj').games[tableNumber - 1];
let currentPlayerId;
let currentPlayers = [] 
var table,data=[] ;

initializeTable();
initializeListeners();
getInventoryCategory();
getCurrentPlayers();
populatePlayers();
ipc.once('Reload Table',(event,message)=>
{
    getTableData();
})

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
    console.log(currentGame)
}

function clearFields(orderType)
{
    if (orderType =='kitchen')
        {
           document.getElementById('kitchenItem').value ='';
           document.getElementById('kitchenPrice').value ='';
           
        }
    else  if (orderType =='inventory')
    {
       document.getElementById('itemCategorySelector').selectedIndex ='0';
       document.getElementById('itemSelector').selectedIndex ='0';
       document.getElementById('itemPrice').value ='';
       document.getElementById('itemQuantityStock').value ='';
       document.getElementById('itemQuantity').value ='';
       
    }
    else if (orderType =='misc')
    {
        document.getElementById('miscItem').value ='';
           document.getElementById('miscPrice').value ='';
    }
        
}

//Render Modal
function modalScript(playerId) {
    currentPlayerId = playerId;
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
    $("#header").append(
        '<div class="w3-bar-item">' +
        '<label>Table No. : ' + tableNumber + '</label>' +
        '</div>' +
        '<div class="w3-bar-item">' +
        '<label>Game Type: ' + currentGame.gameType + ' </label>' +
        '</div>' +
        '<div class="w3-bar-item">' +
        '<label>Start Time: ' + currentGame.startTime + '</label>' +
        '</div>'
    );
    let team = 1;
    for (i = 0; i < numberofCurrnetPlayers; i++) {
        if (currentPlayers[i] !== null) {
            $(".grid-container").append(' <div class="grid-item">' +
                '<div id="' + currentPlayers[i].customerId + '"class="playerTitle">' +
                '<label class="player">' + currentPlayers[i].customerName + '</label>' +
                '</div>' +
                '<div class="hoverBody">' +
                '<button id="btnAddExtra" class="btnAddExtra"  onClick="modalScript(' + currentPlayers[i].customerId + ')">Add Extra</button>' +
                '</div>' +
                '</div>');
            if (currentGame.gameType === "Double") {
                if (i == 0 || i == 2) {
                    $(".playersList").append("<option id=" + currentPlayers[i].customerId + "," + currentPlayers[i + 1].customerId + ">" + "Team " + team + " ( " + currentPlayers[i].customerName + " and " + currentPlayers[i + 1].customerName + ")" + "</option");
                    team++;
                }

            }
            else {
                $(".playersList").append("<option id=" + currentPlayers[i].customerId + ">" + currentPlayers[i].customerName + "</option");
            }

        }
    }

}

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

//Function For Getting Invenory Categories
function initializeListeners() {
    $(document).ready(function () {

        $('#addItemSelector').change(function () {
            $('#currentItemQuantityStock').val("In Stock: " + $("option:selected", this).attr("data-quantity"))
        })
        $('#itemSelector').change(function () {
            $("#itemPrice").val($('#itemSelector').val())
            $('#itemQuantityStock').val("In Stock: " + $("option:selected", this).attr("data-quantity"))
        })

        $('#itemCategorySelector').change(function () {
            let selectedValue = $("#itemCategorySelector").val();
            ipc.send('get-inventory', selectedValue);
            ipc.once('Stock', (event, inventory) => {
                // Remove previous Select Option
                $('select#itemSelector')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option value="text" disabled selected>Select Item</option>');

                for (let i = 0; i < inventory.length; i++) {
                    $("#itemSelector").append($("<option>")
                        .val(inventory[i].itemAmount)
                        .html(inventory[i].itemName)
                        .attr('data-quantity', inventory[i].quantity)

                    );
                    console.log(inventory[i].quantity)
                }
            })
        });
        $('#addItemCategorySelector').change(function () {
            let selectedValue = $("#addItemCategorySelector").val();
            ipc.send('get-inventory', selectedValue);
            ipc.once('Stock', (event, inventory) => {
                // Remove previous Select Option
                $('select#addItemSelector')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option value="text" disabled selected>Select Item</option>');

                for (let i = 0; i < inventory.length; i++) {
                    $("#addItemSelector").append($("<option>")
                        .val(inventory[i].itemAmount)
                        .html(inventory[i].itemName)
                        .attr('data-quantity', inventory[i].quantity)
                    );

                }
            })
        });
    });
}

//Get table Data (Drinks, Cigarettes, Kitchen, Miscellaneous)
function getTableData() {
    data=[]
    ipc.send('get-table-data', currentGame.gameId)
    ipc.once('table-data', (event, tableData) => {
        for (let i = 0; i < tableData.length; i++) {
            data.push(tableData[i])
        }
        table.clear().rows.add(data).draw();
    })
    
}

//Drinks Order
function drinksOrder() {
    let selectedDrink = $("select#DrinkSelect").children("option:selected").val();
    const drinkFilter = drinkStock.filter((drink => (drink.inventoryId === parseInt(selectedDrink))));
    let inventoryId = drinkFilter[0].inventoryId;
    let price = drinkFilter[0].itemAmount;
    let gameId = currentGame.gameId;
    let quantity = $("#DrinkQuantity").val()
    ipc.send('add-order', inventoryId, gameId, currentPlayerId, quantity, price)
    
}

//Cigarettes Order
function cigarettesOrder() {
    var selectedCigarette = $("select#CigaretteSelect").children("option:selected").val();
    const cigaretteFilter = cigaretteStock.filter((cigarette => (cigarette.inventoryId === parseInt(selectedCigarette))));
    let inventoryId = cigaretteFilter[0].inventoryId;
    let price = cigaretteFilter[0].itemAmount;
    let gameId = currentGame.gameId;
    let quantity = $("#CigaretteQuantity").val()
    ipc.send('add-order', inventoryId, gameId, currentPlayerId, quantity, price)
    
}

//Inventory Order

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
            clearFields('inventory');
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



//Kitchen Order
function kitchenOrder()
{
    let kitchenItem=$("#kitchenItem").val();
    let kitchenPrice=$("#kitchenPrice").val();
    let gameId=currentGame.gameId;
    ipc.send('add-order-others',gameId,currentPlayerId,"Kitchen",kitchenItem,kitchenPrice)
    clearFields('kitchen');
       
}

//Kitchen Order
function miscOrder()
{
    let miscItem=$("#miscItem").val();
    let miscPrice=$("#miscPrice").val();
    let gameId=currentGame.gameId;
    ipc.send('add-order-others',gameId,currentPlayerId,"Misc",miscItem,miscPrice)
    clearFields('misc')
          
}

//Inventory Order
function inventoryOrder() {
    let selectedItem = $("select#itemSelector").children("option:selected").html();
    let itemPrice = $("select#itemSelector").children("option:selected").val();
    let quantity = $("#itemQuantity").val()
    let gameId = currentGame.gameId;
    if (selectedItem != "") 
    {
        ipc.send('add-order', selectedItem, gameId, currentPlayerId, quantity, itemPrice)
        clearFields('inventory')
    }
    else 
    {
        ipc.send('error-dialog', "Empty field(s)");
    }
}

//End Game 
function endGame() {
    console.log("End Game Called")
    if (currentGame.gameType === "Single" || currentGame.gameType === "Century") {
        var loser = $("select#loserSelect").children("option:selected").val();
        const player=currentPlayers.filter(player => (player!=null && player.customerName == loser));
        let amount=$("#amount").val()
            if(player.length<1)
            {
                ipc.send('error-dialog',"Please Select a Loser");
                return;
            }
            else if(amount<=0)
            {
                ipc.send('error-dialog',"Please Enter Amount");
                return;
            }
            else
            {
                let gameId=currentGame.gameId;
                let loserId1=player[0].customerId;
                if(!$( "#finalCheckBox" ).prop('checked'))
                {
                    ipc.send('end-game',gameId,amount,loserId1,null)
                    remote.getCurrentWindow().close()
                }
                else
                {
                    const winners=currentPlayers.filter(player=>(player!=null&&player.customerId!=loserId1 ))
                    let winnerId1=winners[0].customerId
                    let totalGames=$('#numberOfGames').val()
                    ipc.send('end-game-final',totalGames,gameId,amount,winnerId1,null,loserId1,null)
                    remote.getCurrentWindow().close()
                }
                
            }
    }
    else
    {
        
            var loser = $("select#loserSelect").children("option:selected").attr('id');
            let amount=$("#amount").val()
            loser = loser.split(",");
            let loserId1=parseInt(loser[0]);
            let loserId2=parseInt(loser[1])
            let gameId = currentGame.gameId;
            if(loser=="")
            {
                ipc.send('error-dialog',"Please Select a Loser");
                return;
            }
            else if(amount<=0)
            {
                ipc.send('error-dialog',"Please Enter Amount");
                return;
            }
            
            else
            {
                if (!$("#finalCheckBox").prop('checked')) 
                {
                ipc.send('end-game', gameId, amount, loserId1, loserId2)
                remote.getCurrentWindow().close()
                }
                else
                {
                    const winners=currentPlayers.filter(player=>(player!=null&&player.customerId!=loserId1&&player.customerId!=loserId2 ))
                    let winnerId1=winners[0].customerId
                    let winnerId2=winners[1].customerId
                    let totalGames=$('#numberOfGames').val()
                    ipc.send('end-game-final',totalGames,gameId,amount,winnerId1,winnerId2,loserId1,loserId2)
                    remote.getCurrentWindow().close()
                }
            }
        }
        


    
}

function nextGame() {
    const status = "ongoing";
    const today = new Date();
    const startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    let playersArray = []
    for (let i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i] !== null) {
            playersArray.push(currentPlayers[i].customerId)
        }
        else {
            playersArray.push(null)
        }

    }
    
    ipc.send('start-game', tableNumber, status, currentGame.gameType, ...playersArray, startTime, createDate)
    endGame();
}


//Getting Inventory
function initializeTable()
{
    $(document).ready(function () {
      table=$('#gameExpense').DataTable({
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        data: data,
        "columns": [
            {
                data: "orderItem"
            },
            {
                data: "orderDescription"
            },
            {
                data: "orderAmount"
            },
            {
                data: "customerName"
            }
    
        ]
    })
    getTableData()
    });
    
}
