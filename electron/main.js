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
    status1:'Vacant'
}

const connections=require("./DataBaseOperations/connections.js");
connections.createTables();

// let winTab11 = remote.getGlobal('winTab11')
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

ipc.on('start-game-single',function(event, table, p1, p2, fin, startTime, status){
    global.sharedObj = {
        tableNumber:table,
        game:'single',
        player1: p1,
        player2: p2,
        final: fin,
        start: startTime,
        status1:status
    }
    console.log(table)
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

ipc.on('empty-single-game',function(event){
    dialog.showErrorBox("OOPS!",'Empty fields')
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
