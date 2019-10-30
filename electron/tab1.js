const { remote } =require('electron');
const electron= require('electron');
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')


function table1() {
    
    let tableNumber = remote.getGlobal('sharedObj').tableNumber
    let status = remote.getGlobal('sharedObj').status1
    
    var selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if(selectedValue=='single'){
        // CREATING INPUT TAGS FOR PLAYER 1 AND PLAYER 2
        var body=document.getElementById("body");
        var final=document.createElement("input");
        final.setAttribute("type","checkbox")
        var tableTypeText=document.createElement("h1")
        tableTypeText.innerHTML="Table Type : Single"
        var finalLabel=document.createElement("p")
        finalLabel.innerHTML="Final"
        var brak =document.createElement("br");
        var playerOne=document.createElement("input");
        playerOne.placeholder="Player One";
        playerOne.setAttribute("required",true);
        var vsTextSpn=document.createElement("span");
        var vsText=document.createTextNode("VS");
        vsTextSpn.appendChild(vsText);
        var playerTwo=document.createElement("input");
        playerTwo.placeholder="Player Two"
        playerTwo.setAttribute("required",true);
        var hr=document.createElement('hr')
        var brak2 =document.createElement("br");
        var brak3 =document.createElement("br");
        var Text1=document.createTextNode("Start Time");
        var startTime=document.createElement("input");
        var d = new Date();
        var n = d.toLocaleTimeString();
        startTime.value=n;
        var btnStart=document.createElement("button");
        btnStart.setAttribute('content', 'Start Game');
        btnStart.innerHTML = 'Start Game'
        var newbody = document.createElement("div");
        newbody.id="body";
        newbody.appendChild(tableTypeText)
        tableTypeText.insertAdjacentElement('afterend',hr)
        newbody.appendChild(finalLabel)
        newbody.appendChild(final)
        newbody.appendChild(brak);
        newbody.appendChild(playerOne);
        newbody.appendChild(vsTextSpn);
        newbody.appendChild(playerTwo);
        newbody.appendChild(brak2);
        newbody.appendChild(Text1);
        newbody.appendChild(startTime);
        newbody.appendChild(brak3);
        newbody.appendChild(btnStart)
        body.replaceWith(newbody)
        var num=document.createElement("input");
        num.setAttribute("type","number")
        num.setAttribute("disabled",true)
        num.setAttribute("min",3)
        num.setAttribute("value",3)
        num.setAttribute("step",2)
        final.insertAdjacentElement('afterend',num)
        num.value=0

        // console.log(final.checked)
        final.addEventListener('change',function(event){
            if(final.checked == true){
                num.value=3;
                num.removeAttribute("disabled")
            }
            else if(final.checked==false){
                num.setAttribute("disabled",true)
                num.value=0
            }
        })

        btnStart.addEventListener('click',function(event){
            if(playerTwo.value!=""&& playerOne.value!=""){
                status="Occupied - Single"
                ipc.send('start-game-single',tableNumber,playerOne.value,playerTwo.value,num.value,startTime.value, status)
                if (win){
                    win.webContents.send ('start-single-game', playerOne.value,playerTwo.value,num.value,startTime.value,"single");
                   ipc.on ('message', (event, message) => { console.log (message); });
               }
                remote.getCurrentWindow().close()
            }
            else if(playerTwo.value==""|| playerOne.value==""){
                ipc.send('empty-single-game')
                playerOne.focus()
            }
        })
    }
    else if(selectedValue=='double'){
       // CREATING INPUT TAGS FOR Team 1 AND Team 2
       var body=document.getElementById("body");
       var tableTypeText=document.createElement("h1")
       var final=document.createElement("input");
       final.setAttribute("type","checkbox")
       var finalLabel=document.createElement("p")
       finalLabel.innerHTML="Final"
       tableTypeText.innerHTML="Table Type : Double"
       var br0 =document.createElement("br");
      var teamHead= document.createElement("p");
      var teamOneText=document.createTextNode("Team One");
       teamHead.appendChild(teamOneText);
       var br1 =document.createElement("br");
       var playerOne=document.createElement("input");
       playerOne.placeholder="Player One";
       var vsTextSpn=document.createElement("span");
       var vsText=document.createTextNode(" Teamed up with ");
       vsTextSpn.appendChild(vsText);
       var playerTwo=document.createElement("input");
       playerTwo.placeholder="Player Two"
       //TEAM TWO
       var br2=document.createElement("br");
       var teamTwoHead= document.createElement("p");
        var teamTwoText=document.createTextNode("Team Two");
        teamTwoHead.appendChild(teamTwoText);
       var br3 =document.createElement("br");
       var t2playerOne=document.createElement("input");
       t2playerOne.placeholder="Player One";
       var vs1TextSpn=document.createElement("span");
       var vs1Text=document.createTextNode(" Teamed up with ");
       vs1TextSpn.appendChild(vs1Text);
       var t2playerTwo=document.createElement("input");
       t2playerTwo.placeholder="Player Two"
       brak1 =document.createElement("br");
       var brak3 =document.createElement("br");
        var Text1=document.createTextNode("Start Time");
        var startTime=document.createElement("input");
        var d = new Date();
        var n = d.toLocaleTimeString();
        startTime.value=n;
       var btnStart=document.createElement("button");
       btnStart.setAttribute('content', 'Start Game Time');
       btnStart.innerHTML = 'Start Game Time'
       var newbody = document.createElement("div");
       newbody.id="body";
       newbody.appendChild(tableTypeText)
       newbody.appendChild(finalLabel)
       newbody.appendChild(final)
       newbody.appendChild(br0);
       newbody.appendChild(teamHead);
       newbody.appendChild(br1);
       newbody.appendChild(playerOne);
       newbody.appendChild(playerTwo);
       newbody.appendChild(br2);
       newbody.appendChild(teamTwoHead);
       newbody.appendChild(br3);
       newbody.appendChild(t2playerOne);
       newbody.appendChild(t2playerTwo);
       newbody.appendChild(brak1);
       newbody.appendChild(Text1);
       newbody.appendChild(startTime);
       newbody.appendChild(brak3)
       newbody.appendChild(btnStart)
       body.replaceWith(newbody)

       
       var num=document.createElement("input");
       num.setAttribute("type","number")
       num.setAttribute("disabled",true)
       num.setAttribute("min",3)
       num.setAttribute("value",3)
       num.setAttribute("step",2)
       final.insertAdjacentElement('afterend',num)
       num.value=0

       // console.log(final.checked)
       final.addEventListener('change',function(event){
           if(final.checked == true){
               num.value=3;
               num.removeAttribute("disabled")
           }
           else if(final.checked==false){
               num.setAttribute("disabled",true)
               num.value=0
           }
       })
       btnStart.addEventListener('click',function(event){
           if(playerTwo.value!=""&& playerOne.value!=""&& t2playerTwo.value!=""&& t2playerOne.value!=""){
               status="Occupied - Double"
               ipc.send('start-game-double',tableNumber,playerOne.value,playerTwo.value,t2playerOne.value,t2playerTwo.value,num.value,startTime.value, status)
               if (win){
                   win.webContents.send ('start-single-game', playerOne.value,playerTwo.value,num.value,startTime.value,"double");
                  ipc.on ('message', (event, message) => { console.log (message); });
              }
               remote.getCurrentWindow().close()
           }
           else if(playerTwo.value==""|| playerOne.value==""|| t2playerOne.value==""|| t2playerTwo.value==""){
               ipc.send('empty-single-game')
               playerOne.focus()
           }
       })

       btnStart.addEventListener('click',function(event){
        event.preventDefault();
        console.log(playerOne.value);
        console.log(playerTwo.value);
        console.log(startTime.value);
    })

    }
    else if(selectedValue=='century'){
        let count=2
        // CREATING INPUT TAGS FOR PLAYER 1 AND PLAYER 2
        var body = document.getElementById("body");
        var tableTypeText=document.createElement("h1")
        tableTypeText.innerHTML="Table Type : Century"
        var brak =document.createElement("br");
        var playerOne=document.createElement("input");
        playerOne.placeholder="Player 1";
        var vsTextSpn=document.createElement("span");
        var vsText=document.createTextNode("     VS     ");
        vsTextSpn.appendChild(vsText);
        var playerTwo=document.createElement("input");
        playerTwo.placeholder="Player 2";
        brak1 =document.createElement("br");
        var brak3 =document.createElement("br");
         var Text1=document.createTextNode("Start Time");
         var startTime=document.createElement("input");
         var d = new Date();
         var n = d.toLocaleTimeString();
         startTime.value=n;
        var btnStart=document.createElement("button");
        var addPlayer=document.createElement("button");
        addPlayer.innerHTML = 'Add Player'
        btnStart.setAttribute('content', 'Start Game Time');
        btnStart.innerHTML = 'Start Game Time'
        var newbody = document.createElement("div");
        newbody.id="body";
        newbody.appendChild(tableTypeText)
        newbody.appendChild(brak);
        newbody.appendChild(playerOne);
        newbody.appendChild(playerTwo);
        newbody.appendChild(addPlayer);
        newbody.appendChild(brak1);
        newbody.appendChild(Text1);
        newbody.appendChild(startTime);
        newbody.appendChild(brak3);
        newbody.appendChild(btnStart)
        body.replaceWith(newbody)

        let player;

        addPlayer.addEventListener('click',function(event){
            count=count+1;
            player=document.createElement("input");
            player.placeholder="Player "+count;
            playerTwo.insertAdjacentElement('afterend',player)
        })

        btnStart.addEventListener('click',function(event){
            if(playerTwo.value!=""&& playerOne.value!=""){
                status="Occupied - Century"
                ipc.send('start-game-century',tableNumber,playerOne.value,playerTwo.value, null, startTime.value, status)
                if (win){
                    win.webContents.send ('start-single-game', playerOne.value,playerTwo.value,null,startTime.value,"century");
                   ipc.on ('message', (event, message) => { console.log (message); });
                   remote.getCurrentWindow().close()
               }
            }
            else if(playerTwo.value==""|| playerOne.value==""){
                ipc.send('empty-single-game')
                playerOne.focus()

            }
        })
    }

   }
   
   function hello(){
   if(remote.getGlobal('sharedObj').game==='single'){
     document.getElementById('p1').innerHTML="Player 1: "+remote.getGlobal('sharedObj').player1
     document.getElementById('p2').innerHTML="Player 2: "+remote.getGlobal('sharedObj').player2
     document.getElementById('final').innerHTML="Final: "+remote.getGlobal('sharedObj').final
     document.getElementById('startTime').innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
   }
   else if(remote.getGlobal('sharedObj').game==='double'){  
     document.getElementById('p1').innerHTML="Player 1: "+remote.getGlobal('sharedObj').player1
     document.getElementById('p2').innerHTML="Player 2: "+remote.getGlobal('sharedObj').player2
     document.getElementById('final').innerHTML="Final: "+remote.getGlobal('sharedObj').final
     document.getElementById('startTime').innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
   }
   else{
    var body=document.getElementById("body");
    var tableTypeText=document.createElement("h1")
    tableTypeText.innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
    var br0 =document.createElement("br");
   var teamHead= document.createElement("p");
   var teamOneText=document.createTextNode("Team One");
    teamHead.appendChild(teamOneText);
    var br1 =document.createElement("br");
    var vsTextSpn=document.createElement("span");
    var vsText=document.createTextNode(" Teamed up with ");
    vsTextSpn.appendChild(vsText);
    //TEAM TWO
    var br2=document.createElement("br");
    var teamTwoHead= document.createElement("p");
     var teamTwoText=document.createTextNode("Team Two");
     teamTwoHead.appendChild(teamTwoText);
    var br3 =document.createElement("br");
    var vs1TextSpn=document.createElement("span");
    var vs1Text=document.createTextNode(" Teamed up with ");
    vs1TextSpn.appendChild(vs1Text);
    brak1 =document.createElement("br");
    var brak3 =document.createElement("br");
     var Final=document.createTextNode("Final: "+remote.getGlobal('sharedObj').final);
    var btnStart=document.createElement("button");
    btnClose.setAttribute('content', 'End Game');
    btnClose.innerHTML = 'End Game'
    var newbody = document.createElement("div");
    newbody.id="body";
    newbody.appendChild(tableTypeText)
    newbody.appendChild(br0);
    newbody.appendChild(teamHead);
    newbody.appendChild(br1);
    newbody.appendChild(br2);
    newbody.appendChild(teamTwoHead);
    newbody.appendChild(br3);
    newbody.appendChild(brak1);
    newbody.appendChild(Final);
    newbody.appendChild(brak3)
    newbody.appendChild(btnClose)
    body.replaceWith(newbody)
   }
}