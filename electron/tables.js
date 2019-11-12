const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const path = require('path');
const url =  require('url');
const ipc = electron.ipcRenderer;
let parentWindow = remote.getCurrentWindow() //parentWindow

global.winTab01=null
global.winTab11=null

let s1 = document.getElementById("s1") //Status of table 1
let s2 = document.getElementById("s2") //Status of table 2
let s3 = document.getElementById("s3") //Status of table 3
let s4 = document.getElementById("s4") //Status of table 4
let s5 = document.getElementById("s5") //Status of table 5
let s6 = document.getElementById("s6") //Status of table 6
let s7 = document.getElementById("s7") //Status of table 7
let s8 = document.getElementById("s8") //Status of table 8

s1.innerHTML = remote.getGlobal('sharedObj').status1; //Update status of table 1
s2.innerHTML = remote.getGlobal('sharedObj').status2; //Update status of table 2
s3.innerHTML = remote.getGlobal('sharedObj').status3; //Update status of table 3
s4.innerHTML = remote.getGlobal('sharedObj').status4; //Update status of table 4
s5.innerHTML = remote.getGlobal('sharedObj').status5; //Update status of table 5
s6.innerHTML = remote.getGlobal('sharedObj').status6; //Update status of table 6
s7.innerHTML = remote.getGlobal('sharedObj').status7; //Update status of table 7
s8.innerHTML = remote.getGlobal('sharedObj').status8; //Update status of table 8

const tab1 = document.getElementById('tab1');
const tab2 = document.getElementById('tab2');
const tab3 = document.getElementById('tab3');
const tab4 = document.getElementById('tab4');
const tab5 = document.getElementById('tab5');
const tab6 = document.getElementById('tab6');
const tab7 = document.getElementById('tab7');
const tab8 = document.getElementById('tab8');

tab1.addEventListener('click',function(event){
    openGameWindow(1,s1)
})

tab2.addEventListener('click',function(event){
    openGameWindow(2,s2)
})

tab3.addEventListener('click',function(event){
    openGameWindow(3,s3)
})

tab4.addEventListener('click',function(event){
    openGameWindow(4,s4)
})

tab5.addEventListener('click',function(event){
    openGameWindow(5,s5)
})

tab6.addEventListener('click',function(event){
    openGameWindow(6,s6)
})

tab7.addEventListener('click',function(event){
    openGameWindow(7,s7)
})

tab8.addEventListener('click',function(event){
    openGameWindow(8,s8)
})

//Open 'add game' or 'edit game' window
function openGameWindow(tableNum,status){
    remote.getGlobal('sharedObj').tableNumber = tableNum;
    console.log(remote.getGlobal('sharedObj').players)
    if(status.innerHTML==="Vacant"){
        let winTab01= new BrowserWindow({
            parent:parentWindow,
            title:'Add New Game Now',
            fullscreen:false,
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
    }
}    









