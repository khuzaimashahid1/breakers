const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const path = require('path');
const url =  require('url');
const ipc = electron.ipcRenderer;
let parentWindow = remote.getCurrentWindow() //parentWindow

global.winStartGame=null
global.winEndGame=null
setStatusAndEventListeners();

//Open 'add game'window
function openStartGame(){
    let winStartGame= new BrowserWindow({
            parent:parentWindow,
            title:'Add New Game Now',
            fullscreen:false,
            maximizable:false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true
                
            }
        });
        winStartGame.loadURL(url.format({
            pathname : path.join(__dirname,"./tableStart.html"),
            protocol: "file",
            slashes: "true",
            
        }))
    
}   

//Open 'End Game'window
function openEndGame(){
    let winEndGame= new BrowserWindow({
            parent:parentWindow,
            title:'Add New Game Now',
            fullscreen:false,
            maximizable:false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true
                
            }
        });
    winEndGame.loadURL(url.format({
            pathname : path.join(__dirname,"./tableEnd.html"),
            protocol: "file",
            slashes: "true",
            
        }))
    
}   


//Set Status and Event Listeners Of All Tables
function setStatusAndEventListeners()
{
    let totalTables=8;
    for(let i=0;i<totalTables;i++)
    {
        let currentTable=i+1;
        remote.getGlobal('sharedObj').tableNumber = currentTable;
        let statusField=document.getElementById("s"+currentTable);
        let tableButton=document.getElementById("tab"+currentTable);
        statusField.innerHTML=remote.getGlobal('sharedObj').status[i];
        if(remote.getGlobal('sharedObj').status[i]!=='Vacant')
        {
            tableButton.innerText='End Game';
            tableButton.addEventListener('click',function(event)
            {
                openEndGame();
            })
        }
        else
        {
            tableButton.addEventListener('click',function(event)
            {
                openStartGame();
            })
        }
        
    }
    
    
}







