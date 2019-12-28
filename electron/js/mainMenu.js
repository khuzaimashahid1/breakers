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
startTimer();
//Open 'add game'window
function openStartGame(){
    let winStartGame= new BrowserWindow({
            parent:parentWindow,
            title:'Add New Game Now',
            fullscreen:false,
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
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true
                
            }
        });
    winEndGame.loadURL(url.format({
            pathname : path.join(__dirname,"./tableEndNew.html"),
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
        let statusField=document.getElementById("s"+currentTable);
        let tableButton=document.getElementById("tab"+currentTable);
        statusField.innerHTML=remote.getGlobal('sharedObj').status[i];
        if(remote.getGlobal('sharedObj').status[i]!=='Vacant')
        {
            tableButton.innerText='End Game';
            tableButton.addEventListener('click',function(event)
            {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openEndGame();
            })
        }
        else
        {
            tableButton.addEventListener('click',function(event)
            {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openStartGame();
            })
        }
        
    }
    
    
}
function startTimer()
{
    let games=remote.getGlobal('sharedObj').games;
    console.log(games.length);
    for(let i=0;i<games.length;i++)
    {
        
        if(games[i]!==null)
        {
            
            let startTime=games[i].startTime;
            console.log(startTime)
            startTime = startTime.split(":");
            console.log(startTime);
            const today = new Date();
            let hours= today.getHours()-startTime[0];
            let min=today.getMinutes()-startTime[1];
            let sec=today.getSeconds()-startTime[2];
            let timerField=document.getElementById("timer"+(i+1));
            timerField.innerText=hours+":"+min+":"+sec;
            renderTime(timerField,hours,min,sec);
        }
    }
}

function renderTime(timerField,hour,min,sec)
{
    function intervalFunc() {
        sec++;
        if(sec>60)
        {
            min++;
            sec=0;
        }
        if(min>60)
        {
            hour++;
            min=0;
        }
        
        timerField.innerText=hour+":"+min+":"+sec;
      }
      
      setInterval(intervalFunc, 1000);
}






