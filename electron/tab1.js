const { remote } =require('electron');
const electron= require('electron');
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')
const players= remote.getGlobal('sharedObj').players;
console.log(players);
function selectGame()
{
    let tableNumber = remote.getGlobal('sharedObj').tableNumber
    let status = remote.getGlobal('sharedObj').status1
    const selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    const single=document.getElementById("single");
    const double=document.getElementById("double");
    const century=document.getElementById("century");
    window.$ = window.jQuery = require('jquery');
    if(selectedValue=='single')
    {
        if(double.style.display = "block")
        {
            double.style.display = "none"
        }
        if(century.style.display = "block")
        {
            century.style.display = "none"
        }
        single.style.display = "block";
        $('#singlePlayer1').on('input',function(e){
            $('ul').empty()
            const searchString=$(this).val().toLowerCase();
            for(let i=0;i<players.length;i++)
            {
                const actualName=players[i].customerName.toLowerCase();
                if(actualName.includes(searchString))
                {
                    $("#singlePlayers").append('<li class=\'suggestion\'>'+players[i].customerName+'</li>');
                    $("#singlePlayers li").click(function() {
                        const value=$(this).text();
                        console.log(value);
                        $('#singlePlayer1').val(value);
                       });
                }
                
            }
            // $("#singlePlayers").append('<li><a href="#">'+$(this).val()+'</a></li>');
        });
        
    } 
    else  if(selectedValue=='double')
    {
        if(single.style.display = "block")
        {
            single.style.display = "none"
        }
        if(century.style.display = "block")
        {
            century.style.display = "none"
        }
        double.style.display = "block";
    }
    else  if(selectedValue=='century')
    {
        if(single.style.display = "block")
        {
            single.style.display = "none"
        }
        if(double.style.display = "block")
        {
            double.style.display = "none"
        }
        century.style.display = "block";
        //JQUARY FOR ADD PLAYER ON BUTTON CLICK
        window.$ = window.jQuery = require('jquery');
        var max_fields= 10; //maximum input boxes allowed
        var wrapper= $(".players_fields_wrap"); //Fields wrapper
        var x = 1; //initlal text box count
        $('.addPlayer_field_button').on('click',function(e)
        {
            e.preventDefault();
           
                if(x < max_fields){ //max input box allowed
                    x++; //text box increment
                    $(wrapper).append('<div><input type="text" id="Player_'+x+'" name="Player_'+x+'" placeholder="Player '+x+' Name"/>'); 
                }       
         
        });
        
            
            
      
    }
}


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
        newbody.appendChild(suggestion);
        newbody.appendChild(suggestionItem);
        
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

AddExtrasPlayer1 = document.getElementById("extrasP1")
AddExtrasPlayer1.addEventListener('click',function(event){
    var body=document.getElementById("body");
    var tableTypeText=document.createElement("h1")
    tableTypeText.innerHTML="Player Name: "+remote.getGlobal('sharedObj').player1
    var br0 =document.createElement("br");
   var teamHead= document.createElement("p");
   var Cigarettes=document.createTextNode("Cigarettes");
    teamHead.appendChild(Cigarettes);
    var addCig=document.createElement("button");
    addCig.innerHTML = 'Add'

    var br1 =document.createElement("br");
    var vsTextSpn=document.createElement("span");
    var vsText=document.createTextNode(" Teamed up with ");
    vsTextSpn.appendChild(vsText);
    //TEAM TWO
    var br2=document.createElement("br");
    var teamTwoHead= document.createElement("p");
     var teamTwoText=document.createTextNode("Kitchen");
     teamTwoHead.appendChild(teamTwoText);
     var addKitchen=document.createElement("button");
     addKitchen.innerHTML = 'Add'
    var br3 =document.createElement("br");
    var vs1TextSpn=document.createElement("span");
    var vs1Text=document.createTextNode(" Teamed up with ");
    vs1TextSpn.appendChild(vs1Text);
    brak1 =document.createElement("br");
    var brak3 =document.createElement("br");
     var Final=document.createTextNode("Miscalleniuos");
    var btnClose=document.createElement("button");
    btnClose.setAttribute('content', 'Add Extras');
    btnClose.innerHTML = 'Add Extras'
    var newbody = document.createElement("div");
    newbody.id="body";
    newbody.appendChild(tableTypeText)
    newbody.appendChild(br0);
    newbody.appendChild(teamHead);
    newbody.appendChild(addCig);
    newbody.appendChild(br1);
    newbody.appendChild(br2);
    newbody.appendChild(teamTwoHead);
    newbody.appendChild(addKitchen);
    newbody.appendChild(br3);
    newbody.appendChild(brak1);
    newbody.appendChild(Final);
    newbody.appendChild(brak3)
    newbody.appendChild(btnClose)
    body.replaceWith(newbody)

    let cig = [];
    let kitchen = [];
    kitchenAmount = []
    let kitchenCount= 0;
    let count= 0;

    let game = remote.getGlobal('sharedObj').game
    let player1 = remote.getGlobal('sharedObj').player1
    let player2 = remote.getGlobal('sharedObj').player2
    let tableNumber = remote.getGlobal('sharedObj').tableNumber
    let final = remote.getGlobal('sharedObj').final
    let startTime = remote.getGlobal('sharedObj').start


        addCig.addEventListener('click',function(event){
            cig=document.createElement("input");
            cig.placeholder="Cigarette "+count;
            addCig.insertAdjacentElement('beforebegin',cig)
            count=count+1;
        })

        addKitchen.addEventListener('click',function(event){
            kitchen[kitchenCount]=document.createElement("input");
            kitchen[kitchenCount].placeholder="Kitchen "+kitchenCount;

            kitchenAmount[kitchenCount]=document.createElement("input");
            kitchenAmount[kitchenCount].placeholder="Amount";
            addKitchen.insertAdjacentElement('beforebegin',kitchen[kitchenCount])
            addKitchen.insertAdjacentElement('beforebegin',kitchenAmount[kitchenCount])
            kitchenCount=kitchenCount+1;
        })
        
        btnClose.addEventListener('click',function(event){
            console.log(remote.getGlobal('sharedObj').player1)
            console.log(remote.getGlobal('sharedObj').player2)
            console.log(remote.getGlobal('sharedObj').tableNumber)
            console.log(remote.getGlobal('sharedObj').game)
            for(var i=0;i<kitchenCount;i++)
            {
                ipc.send('add-order',kitchen[i].value,kitchenAmount[i].value,player1,player2,startTime, final, game, tableNumber)
            }
            remote.getCurrentWindow().reload()

        })
})