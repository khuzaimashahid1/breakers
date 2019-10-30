const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const path = require('path');
const url =  require('url');
const ipc = electron.ipcRenderer;


global.winTab01=null
global.winTab11=null

let s1 = document.getElementById("s1") //Status of table1
s1.innerHTML = remote.getGlobal('sharedObj').status1;

let parentWindow = remote.getCurrentWindow() //parentWindow

const tab1 = document.getElementById('tab1');
tab1.addEventListener('click',function(event){
    console.log(remote.getGlobal('sharedObj').players)
    if(s1.innerHTML==="Vacant"){
        let winTab01= new BrowserWindow({
            parent:parentWindow,
            title:'Add New Game Now',
            maximizable:false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                webviewTag: true
                
            }
        });
        winTab01.loadURL(url.format({
            pathname : path.join(__dirname,"./tab1Start.html"),
            protocol: "file",
            slashes: "true",
            
        }))
        remote.getGlobal('sharedObj').tableNumber = "Table1"
        // winTab01.on('close',function(event){
        //     tab1.setAttribute('disabled',false)
        // })
        // tab1.setAttribute('disabled',true)
    }
    else{
        let winTab11= new BrowserWindow({
            parent:parentWindow,
            title:'Edit Game',
            maximizable:false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
            }
        });
        winTab11.loadURL(url.format({
            pathname : path.join(__dirname,"./tab1End.html"),
            protocol: "file",
            slashes: "true"
        }))
        // winTab11.on('close',function(event){
        //     tab1.setAttribute('disabled',false)
        // })
        // tab1.setAttribute('disabled',true)
    }
})    

const t2 = document.getElementById('tab2');
t2.addEventListener('click',function(event){
    console.log("status1")
})

ipc.on('start-single-game', (event, playerOne, playerTwo,num, startTime, message) => {
        console.log(message)
        console.log(playerOne)
        console.log(playerTwo)
        console.log(num)
        console.log(startTime)
        s1.innerHTML=remote.getGlobal('sharedObj').status1
        // remote.getGlobal('sharedObj').status1 = "Occupied"
        // console.log(tableNumber)
 });

