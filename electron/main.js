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
    status1:null,
    status2:null,
    status3:null,
    status4:null,
    status5:null,
    status6:null,
    status7:null,
    status8:null,
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
connections.getOngoingGames().then(result=>
    {
        //First Table Has ongoing game
        if(result[0].length>0)
        {
            global.sharedObj.status1 ='Ongoing - '+result[0][0].gameType;
            // global.sharedObj.status1 ='Vacant';
            
        }
        else{
            global.sharedObj.status1 ='Vacant'
        }
        //Table 2 Has ongoing game
        if(result[1].length>0)
        {
            global.sharedObj.status2 ='Ongoing - '+result[1][0].gameType;
        }
        else{
            global.sharedObj.status2 ='Vacant'
        }
        //Table 3 Has ongoing game
        if(result[2].length>0)
        {
            global.sharedObj.status3 ='Ongoing - '+result[2][0].gameType;
        }
        else{
            global.sharedObj.status3 ='Vacant'
        }
        //Table 4 Has ongoing game
        if(result[3].length>0)
        {
            global.sharedObj.status4 ='Ongoing - '+result[3][0].gameType;
        }
        else{
            global.sharedObj.status4 ='Vacant'
        }
        //Table 5 Has ongoing game
        if(result[4].length>0)
        {
            global.sharedObj.status5 ='Ongoing - '+result[4][0].gameType;
        }
        else{
            global.sharedObj.status5 ='Vacant'
        }
        //Table 6 Has ongoing game
        if(result[5].length>0)
        {
            global.sharedObj.status6 ='Ongoing - '+result[5][0].gameType;
        }
        else{
            global.sharedObj.status6 ='Vacant'
        }
        //Table 7 Has ongoing game
        if(result[6].length>0)
        {
            global.sharedObj.status7 ='Ongoing - '+result[6][0].gameType;
        }
        else{
            global.sharedObj.status7 ='Vacant'
        }
        //Table 8 Has ongoing game
        if(result[7].length>0)
        {
            global.sharedObj.status8 ='Ongoing - '+result[7][0].gameType;
        }
        else{
            global.sharedObj.status8 ='Vacant'
        }
    })
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

//Starting Single Game
ipc.on('start-game-single',function(event, tableNumber, status, gameType, id1, id2, startTime){
    console.log(tableNumber)
    console.log(status)
    console.log(gameType)
    console.log(id1)
    console.log(id2)
    console.log(startTime)
    console.log(createDate)
    connections.startGame(tableNumber, status, gameType, id1, id2, startTime,createDate);
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
