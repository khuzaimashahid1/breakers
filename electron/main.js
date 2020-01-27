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
        fullscreen:false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
        }
    });
    win.maximize();
    win.loadURL(url.format({
        pathname : path.join(__dirname,"./views/Index.html"),
        protocol: "file",
        slashes: "true"
    }))
    
    win.on("closed", ()=> {
        win= null;

    })
}

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
                getAllCustomers();
                getAllOngoingGames();
            }
            
        });
    
})

//Add Customer
ipc.on('add-customer',function(event, customerName,customerAddress,customerPhone,createDate){
    connections.addCustomer(customerName,customerAddress,customerPhone,createDate).then(result=>
        {
            if(result===true)
            {
                getAllCustomers();
                getAllOngoingGames();
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
                getAllOngoingGames();
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

//Add Order Others
ipc.on('add-order-others',function(event,gameId,customerId,categoryName,itemName,amount){
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addOrderOthers(currentDate,gameId,customerId,categoryName,itemName,amount);
})

//End Game
ipc.on('end-game',function(event,gameId,amount,loserId1,loserId2)
{
    const today = new Date();
    const endTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const updateDate = yyyy + '-' + mm + '-' + dd;
    connections.endGame(updateDate,updateDate,gameId,amount,loserId1,loserId2,endTime).then(result=>
        {
            if(result===true)
            {
                getAllCustomers();
                getAllOngoingGames();
            }
            
        });
    
})

//Get Cigarette Stock
ipc.on('get-cigs',function(event)
{
    connections.getCigarettes().then(rows => {
        event.sender.send("Cigarette Stock", rows);
    });
})

//Get Drinks Stock
ipc.on('get-drinks',function(event)
{
    connections.getDrinks().then(rows => {
        event.sender.send("Drinks Stock", rows);
    });
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
            win.webContents.send('Reload', 'New Game Started!')    
        })
            
}
getAllCustomers();
getAllOngoingGames();

