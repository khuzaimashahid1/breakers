const { app, BrowserWindow } = require("electron");
const electron = require("electron")
const { remote } =require('electron');
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const connections=require("./DataBaseOperations/connections.js");
connections.createTables();
getAllCustomers();
getAllOngoingGames();

global.win=null;

global.sharedObj = {
    tableNumber:null,
    status:[],
    games:[],
    players:null
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


ipc.on('add-order',function(event,kitchenVal,kitchenAmt,p1,p2,startTime, final,type, table){
    console.log(global.sharedObj.player1)
    console.log(global.sharedObj.player2)
    console.log(global.sharedObj.tableNumber)
    console.log(global.sharedObj.game)
    global.sharedObj = {
        kitchen: kitchenVal,
        kitchenAmount: kitchenAmt,
        player1:p1,
        player2:p2,
        start: startTime,
        final: final,
        game:type,
        tableNumber: table
    }
    console.log(kitchenVal)
    console.log(kitchenAmt)
    console.log(global.sharedObj.player1)
    console.log(global.sharedObj.player2)
    console.log(global.sharedObj.tableNumber)
    console.log(global.sharedObj.game)
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
            console.log("Players added")
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
                }
                else
                {
                    global.sharedObj.status[i] ='Vacant'
                    global.sharedObj.games[i]=null;
                }
            }  
        })
}
