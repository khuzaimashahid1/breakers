const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const path = require('path');
const url =  require('url');
const ipc = electron.ipcRenderer;
const dialog = electron.dialog;
let s1 = document.getElementById("s1")
global.winTab01=null

let w = remote.getCurrentWindow()

const tab1 = document.getElementById('tab1');
tab1.addEventListener('click',function(event){
    if(s1.innerHTML==='Vacant'){
        let winTab01= new BrowserWindow({
            parent:w,
            title:'Add New Game Now',
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
            }
        });
        winTab01.loadURL(url.format({
            pathname : path.join(__dirname,"tab1Start.html"),
            protocol: "file",
            slashes: "true"
        }))
    }
    else{
        let winTab11= new BrowserWindow({
            parent:w,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
            }
        });
        winTab11.loadURL(url.format({
            pathname : path.join(__dirname,"tab1End.html"),
            protocol: "file",
            slashes: "true"
        }))
    }
})    

const t2 = document.getElementById('tab2');
t2.addEventListener('click',function(event){
    dialog.showErrorBox('Hello','Under Construction')
})

winTab01 = remote.getGlobal(winTab01)
if (winTab01) winTab01.webContents.send ('message', "Message from Window 2");
ipc.on ('message', (event, message) => {
    if(message==="s1"){
        s1.innerHTML="Occupied"
        console.log(s1.innerHTML)
    }
 });
