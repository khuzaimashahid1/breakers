setStatusAndEventListeners();
startTimer();
ipc.on('Reload', (event, message) => {
    setStatusAndEventListeners();
    startTimer();
  })
//Open 'add game'window
function openStartGame(){
    let winStartGame= new BrowserWindow({
            parent:parentWindow,
            title:'New Game',
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
            title:'On-going Game',
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

//OPEN TABLE SUMMARY WINDOW
function openTableSummary(){
    let winEndGame= new BrowserWindow({
            parent:parentWindow,
            title:'Table Summary',
            fullscreen:false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true
                
            }
        });
    
        winEndGame.loadURL(url.format({
            pathname : path.join(__dirname,"./tableSummary.html"),
            protocol: "file",
            slashes: "true",
            
        }))
    
}

//Set Status and Event Listeners Of All Tables 
function setStatusAndEventListeners()
{
    let totalTables=10;
    for(let i=0;i<totalTables;i++)
    {
        let currentTable=i+1;
        
        $('#s'+currentTable).html(remote.getGlobal('sharedObj').status[i]);
        if(remote.getGlobal('sharedObj').status[i]!='Vacant')
        {
            $( "#tab"+currentTable ).html('End Game');
            $( "#tab"+currentTable ).off();
            $( "#tab"+currentTable ).click(function() {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openEndGame();
              });
              $( "#sum"+currentTable ).click(function() {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openTableSummary();
              });              
        }
        else
        {
            $( "#tab"+currentTable ).html('Start Game');
            $( "#tab"+currentTable ).off();
            $( "#tab"+currentTable ).click(function() {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openStartGame();
              });
              $("#sum"+currentTable ).click(function() {
                remote.getGlobal('sharedObj').tableNumber = currentTable;
                openTableSummary();
              }); 
        }
        
    }
    
    
}
function startTimer()
{
    let games=remote.getGlobal('sharedObj').games;
    for(let i=0;i<games.length;i++)
    {
        
        if(games[i]!==null)
        {
            
            let startTime=games[i].startTime;
            startTime = startTime.split(":");
            const today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            const createDate = yyyy + '-' + mm + '-' + dd;
            const currentDate=games[i].createDate;
            let hours,min,sec,timerField;
            if(createDate===currentDate)
            {
                hours= Math.abs(today.getHours()-startTime[0]);
                min=Math.abs(today.getMinutes()-startTime[1]);
                sec=Math.abs(today.getSeconds()-startTime[2]);
                timerField="#timer"+(i+1)
                let newTimerField=$(timerField).clone()
                $(timerField).replaceWith(newTimerField);
                $(newTimerField).html(hours+":"+min+":"+sec)
                renderTime(newTimerField,hours,min,sec);
                
            }
            else
            {
                hours= Math.abs(24-startTime[0]+today.getHours());
                min=Math.abs(60-startTime[1]+today.getMinutes());
                sec=Math.abs(60-startTime[2]+today.getSeconds());
                timerField="#timer"+(i+1)
                let newTimerField=$(timerField).clone()
                $(timerField).replaceWith(newTimerField);
                $(newTimerField).html(hours+":"+min+":"+sec)
                renderTime(newTimerField,hours,min,sec);
            }
            
        }
        else
        {
            timerField="#timer"+(i+1)
            let newTimerField=$(timerField).clone()
                $(timerField).replaceWith(newTimerField);
                $(newTimerField).html(0+":"+0+":"+0)
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
        
        $(timerField).html(hour+":"+min+":"+sec);
      }
      
      setInterval(intervalFunc, 1000);
}
