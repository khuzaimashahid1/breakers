const { app, BrowserWindow } = require("electron");
const electron = require("electron")
const { remote } =require('electron');
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;

global.win=null;

global.sharedObj = {
    tableNumber:null,
    type:null,
    game:null,
    player1: null,
    player2: null,
    final: null,
    start: null,
    status1:'Vacant',
    kitchen:null,
    kitchenAmount:null,
    players:null
}


const connections=require("./DataBaseOperations/connections.js");
connections.createTables();
connections.getCustomers().then(rows=>
    {
        global.sharedObj.players =rows;
        console.log("Players added")
        // console.log(rows) ;
    });

function createWindow(){
    win = new BrowserWindow({
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
        }
    });

    win.loadURL(url.format({
        pathname : path.join(__dirname,"./views/tables.html"),
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



ipc.on('start-game-single',function(event, tableNumber, status, gameType, id1, id2, startTime){
    console.log(tableNumber)
    console.log(status)
    console.log(gameType)
    console.log(id1)
    console.log(id2)
    console.log(startTime)
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

ipc.on('start-game-double',function(event, table, p1, p2, p3, p4, fin, startTime, status){
    global.sharedObj = {
        tableNumber:table,
        game:'double',
        player1: p1,
        player2: p2,
        player3: p3,
        player4: p4,
        final: fin,
        start: startTime,
        status1:status
    }
    console.log(table)
})

ipc.on('start-game-century',function(event, table, p1, p2, fin, startTime, status){
    global.sharedObj = {
        tableNumber:table,
        game:'century',
        final:fin,
        player1: p1,
        player2: p2,
        start: startTime,
        status1:status
    }
    console.log(table)
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
