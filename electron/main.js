const { app, BrowserWindow } = require("electron");
const electron = require("electron")
const { remote } =require('electron');
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const connections=require("./DataBaseOperations/connections.js");
connections.createTables();
global.win=null;
global.sharedObj = {
    tableNumber:null,
    status:[],
    games:[],
    allplayers:null,
    players:null,
    currentPlayers:[]
}
function createWindow(){
    win = new BrowserWindow({
        fullscreen:true,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
        }
    });

    win.loadURL(url.format({
        pathname : path.join(__dirname,"./views/mainMenu.html"),
        protocol: "file",
        slashes: "true"
    }))

    win.on("closed", ()=> {
        win= null;

    })
}

//Place Kitchen Order
ipc.on('place-kitchen-order',function(event,customerName,orderItem,price){
    console.log(customerName)
    console.log(orderItem)
    console.log(price)
})

//Place Drink Order
ipc.on('place-drink-order',function(event,customerName,orderItem,price){
    console.log(customerName)
    console.log(orderItem)
    console.log(price)
})

//Error Dialouge Box Pop-up
ipc.on('error-dialog',function(event,message){
    dialog.showErrorBox("ERROR",message)
})

//Starting Game
ipc.on('start-game',function(event, tableNumber, status, gameType, id1, id2,id3,id4,id5,id6,id7,id8,id9,id10, startTime,createDate){
    connections.startGame(tableNumber, status, gameType,  id1, id2,id3,id4,id5,id6,id7,id8,id9,id10, startTime,createDate).then(result=>
        {
            if(result===true)
            {
                getAllOngoingGames();
                win.reload();
            }
            
        });
    
})

//Add Customer
ipc.on('add-customer',function(event, customerName,customerAddress,customerPhone,createDate){
    connections.addCustomer(customerName,customerAddress,customerPhone,createDate).then(result=>
        {
            if(result===true)
            {
                getAllCustomers()
                win.reload();
                console.log("Player Added")
            }
            
        });
    
})

//Delete Customer
ipc.on('delete-customer',function(event, customerId){
    connections.deleteCustomer(customerId).then(result=>
        {
            if(result===true)
            {
                getAllCustomers()
                win.reload();
                console.log("Player Deleted")
            }
            
        });
    
})

//Add Order
ipc.on('add-order',function(event,inventoryId,gameId,customerId,quantity,amount){
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addOrder(currentDate,currentDate,inventoryId,gameId,customerId,quantity,amount);
})

app.on('ready', createWindow);

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate',()=>{
    if(win== null){
        createWindow()
    }
})

//Gets All Customers
function getAllCustomers()
{
    connections.getCustomers().then(rows=>
        {   
            global.sharedObj.players =rows;
            global.sharedObj.allplayers =rows;
            console.log("All Customers Fetched From DB")
        });
}

//Gets All ongoing Games on All Tables
function getAllOngoingGames()
{
    connections.getOngoingGames().then(result=>
        {
            for(let i=0;i<result.length;i++)
            {
                //Check if Each Table Has ongoing game
                if(result[i].length>0)
                {
                    global.sharedObj.status[i] ='Ongoing - '+result[i][0].gameType;
                    global.sharedObj.games[i]=result[i][0];
                    Object.values(global.sharedObj.games[i]).forEach(function(value,index) 
                    {
                        if(index>5&&index<16)
                        {
                            
                            if(value!==null)
                            {
                                if((global.sharedObj.currentPlayers.filter(currentPlayer => (currentPlayer.customerId === value))).length===0)
                                {
                                    const player=global.sharedObj.players.filter((player => (player.customerId === (value))));
                                    global.sharedObj.currentPlayers.push(player[0]);
                                    global.sharedObj.players=global.sharedObj.players.filter(currentPlayer => (currentPlayer !== player[0]));
                                }
                                
                                
                            }
                        } 
                    });
                }
                else
                {
                    global.sharedObj.status[i] ='Vacant'
                    global.sharedObj.games[i]=null;
                }
            } 
        })
        
}
getAllCustomers();
getAllOngoingGames();
