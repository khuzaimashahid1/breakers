const { remote } = require('electron');
const electron = require('electron');
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')
const players = remote.getGlobal('sharedObj').players;
window.$ = window.jQuery = require('jquery');
let tableNumber = remote.getGlobal('sharedObj').tableNumber
let status = remote.getGlobal('sharedObj').status1
var centuryPlayersCount = 1;
var centuryMaxPlayers = 10;

function selectGame()
{
    const selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    const single=document.getElementById("single");
    const double=document.getElementById("double");
    const century=document.getElementById("century");
    const btnStartSingle=document.getElementById("btnStartSingle");
    const btnStartDouble=document.getElementById("btnStartDouble");
    const btnStartCentury=document.getElementById("btnStartCentury");
    setStartTime();
    if(selectedValue=='single')
    {
        displayFirstDivOnly(single,double,century);
        const singleFieldID1='#singlePlayer1';
        const singleListID1='#singlePlayers1';
        const singleFieldID2='#singlePlayer2';
        const singleListID2='#singlePlayers2';
        renderSuggestions(singleFieldID1,singleListID1);
        renderSuggestions(singleFieldID2,singleListID2);
        
        
        btnStartSingle.addEventListener('click',function(event){
            if($(singleFieldID1).val().length !== 0 && $(singleFieldID2).val().length !== 0)
            {
                const singlePlayer1=players.filter(player => (player.customerName === ($(singleFieldID1).val())));
                const singlePlayer2=players.filter(player => (player.customerName === ($(singleFieldID2).val())));
                if(singlePlayer1.length<1)
                {
                    ipc.send('error-dialog',"Player1 Not in Database");
                    $(singleFieldID1).focus();
                }
                else if(singlePlayer2.length<1)
                {
                    ipc.send('error-dialog',"Player2 Not in Database");
                    $(singleFieldID2).focus();
                }
                else if(singlePlayer1[0]===singlePlayer2[0])
                {
                    ipc.send('error-dialog',"You Have Selected Same Players in Both Fields");
                }
                else
                {
                const status="ongoing";
                const gameType="single";
                const singlePlayer1Id=singlePlayer1[0].customerId;
                const singlePlayer2Id=singlePlayer2[0].customerId;
                const today = new Date();
                const startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                createDate = yyyy + '-' + mm + '-' + dd;
                ipc.send('start-game-single',tableNumber,status,gameType,singlePlayer1Id,singlePlayer2Id,startTime,createDate)
                remote.getCurrentWindow().close()}
            }
            else if($(singleFieldID1).val().length === 0 )
            {
                ipc.send('error-dialog',"Please Enter Player 1");
                $(singleFieldID1).focus();
            }
            else if($(singleFieldID2).val().length === 0)
            {
                ipc.send('error-dialog',"Please Enter Player 2");
                $(singleFieldID2).focus();
            }
        })
        
    } 
    else  if(selectedValue=='double')
    {
        displayFirstDivOnly(double,century,single);
        const doubleFieldID1='#doublePlayer1';
        const doubleListID1='#doublePlayers1';
        const doubleFieldID2='#doublePlayer2';
        const doubleListID2='#doublePlayers2';
        const doubleFieldID3='#doublePlayer3';
        const doubleListID3='#doublePlayers3';
        const doubleFieldID4='#doublePlayer4';
        const doubleListID4='#doublePlayers4';
        renderSuggestions(doubleFieldID1,doubleListID1);
        renderSuggestions(doubleFieldID2,doubleListID2);
        renderSuggestions(doubleFieldID3,doubleListID3);
        renderSuggestions(doubleFieldID4,doubleListID4);
    }
    else if (selectedValue == 'double') {
        displayFirstDivOnly(double, century, single);
        const doubleFieldID1 = '#doublePlayer1';
        const doubleListID1 = '#doublePlayers1';
        const doubleFieldID2 = '#doublePlayer2';
        const doubleListID2 = '#doublePlayers2';
        const doubleFieldID3 = '#doublePlayer3';
        const doubleListID3 = '#doublePlayers3';
        const doubleFieldID4 = '#doublePlayer4';
        const doubleListID4 = '#doublePlayers4';
        renderSuggestions(doubleFieldID1, doubleListID1);
        renderSuggestions(doubleFieldID2, doubleListID2);
        renderSuggestions(doubleFieldID3, doubleListID3);
        renderSuggestions(doubleFieldID4, doubleListID4);
    }
    else if (selectedValue == 'century') {
        displayFirstDivOnly(century, single, double);
        renderSuggestions('#centuryPlayer1', '#centuryPlayers1');
        addPlayerCentury();
        removePlayerCentury();
    }
    else if( selectedValue == 'Choose'){
      single.style.display = "none";
      double.style.display = "none";
      century.style.display = "none";
    }
}

// FUNCTION FOR ADDING PLAYER IN CENTURY
function addPlayerCentury() {
    $('.btnAddPlayerField').on('click', function (e) {
        e.preventDefault();

        if (centuryPlayersCount < centuryMaxPlayers) {
            $('.btnAddPlayerField').attr("disabled", false);
            centuryPlayersCount++;
            $(".playersFieldsWrap").append('<div>' +
                '<input type="text" id="centuryPlayer' + centuryPlayersCount + '" name="centuryPlayer' + centuryPlayersCount + '" placeholder="Player ' + centuryPlayersCount + ' Name"/>' +
                '<ul id="centuryPlayers'+centuryPlayersCount + '"></ul>' +
                '</div>');
        }
        renderSuggestions('#centuryPlayer' + centuryPlayersCount, '#centuryPlayers' + centuryPlayersCount)
        console.log('#centuryPlayer' + centuryPlayersCount);
        //APPENDING REMOVE BUTTON TO LAST CHILD OF THE WRAPPER CLASS
        $('.removeField').remove();
        $('.playersFieldsWrap div:last-child ').append('<button class="removeField">X</button>');
        if (centuryPlayersCount == centuryMaxPlayers) {
            $('.btnAddPlayerField').attr("disabled", true);
            $('.btnAddPlayerField').html("Maximum numbers of players added!");
            $('.btnAddPlayerField').css("background-color", "red");
        }

    });


}

//FUNTION FOR BINDING SUGGESTION RENDERE TO CENTURY PLAYERS
function bindCenturyPlayersToRenderer() {
    //BINDING CHILDs WITH SUGGESTION RENDERER
    var count;
    for (count = 2; count <= centuryPlayersCount; count++) {
        renderSuggestions('#centuryPlayer' + count, '#centuryPlayers' + count);
        console.log('#centuryPlayer' + count, '#centuryPlayers' + count);
    }

}


// FUNCTION FOR REMOVING A PLAYER 
function removePlayerCentury() {
    //  REMOVING A FIELD BY JQUERY
    $(".playersFieldsWrap").on("click", ".removeField", function (e) {
        //user click on remove text
        e.preventDefault();
        if (centuryPlayersCount > 1) {
            
            $(this).parent('div').remove(); centuryPlayersCount--;
            $('.btnAddPlayerField').attr("disabled", false);
            $('.btnAddPlayerField').html("Add Player");
            $('.btnAddPlayerField').css("background-color", "#4CAF50");
            if(centuryPlayersCount==1){
                $('.removeField').remove();
            }else
                $('.playersFieldsWrap div:last-child').append('<button class="removeField">X</button>');
        }
    });

}
// Set Start Time of Game
function setStartTime() {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const startTimeSingle = document.getElementById("startTimeSingle");
    startTimeSingle.innerHTML = "Start Time:  " + time;
    const startTimeDouble = document.getElementById("startTimeDouble");
    startTimeDouble.innerHTML = "Start Time:  " + time;
    const startTimeCentury = document.getElementById("startTimeCentury");
    startTimeCentury.innerHTML = "Start Time:  " + time;
}

// Display Only Required HTML of first Div
function displayFirstDivOnly(first, second, third) {
    first.style.display = "block";
    if (second.style.display = "block") {
        second.style.display = "none"
    }
    if (third.style.display = "block") {
        third.style.display = "none"
    }

}

//Render Suggestions for Required Field
function renderSuggestions(fieldID, listID) {

    $(fieldID).on('input', function (e) {
        if ($(fieldID).val().length === 0) {
            $(listID).empty();
        }
        else {
            $(listID).empty()
            const searchString = $(this).val().toLowerCase();
            for (let i = 0; i < players.length; i++) {
                const actualName = players[i].customerName.toLowerCase();
                if (actualName.includes(searchString)) {
                    $(listID).append('<li class=\'suggestion\'>' + players[i].customerName + '</li>');
                    $(listID + " li").click(function () {
                        $(listID).empty()
                        const value = $(this).text();
                        $(fieldID).val(value);

                    });
                }
            }
        }

    });
}





















function table1() {

    let tableNumber = remote.getGlobal('sharedObj').tableNumber
    let status = remote.getGlobal('sharedObj').status1

    var selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if (selectedValue == 'single') {
        // CREATING INPUT TAGS FOR PLAYER 1 AND PLAYER 2
        var body = document.getElementById("body");
        var final = document.createElement("input");
        final.setAttribute("type", "checkbox")
        var tableTypeText = document.createElement("h1")
        tableTypeText.innerHTML = "Table Type : Single"
        var finalLabel = document.createElement("p")
        finalLabel.innerHTML = "Final"
        var brak = document.createElement("br");
        var playerOne = document.createElement("input");
        playerOne.placeholder = "Player One";
        playerOne.setAttribute("required", true);
        var vsTextSpn = document.createElement("span");
        var vsText = document.createTextNode("VS");
        vsTextSpn.appendChild(vsText);
        var playerTwo = document.createElement("input");
        playerTwo.placeholder = "Player Two"
        playerTwo.setAttribute("required", true);
        var hr = document.createElement('hr')
        var brak2 = document.createElement("br");
        var brak3 = document.createElement("br");
        var Text1 = document.createTextNode("Start Time");
        var startTime = document.createElement("input");
        var d = new Date();
        var n = d.toLocaleTimeString();
        startTime.value = n;
        var btnStart = document.createElement("button");
        btnStart.setAttribute('content', 'Start Game');
        btnStart.innerHTML = 'Start Game'
        var newbody = document.createElement("div");
        newbody.id = "body";
        newbody.appendChild(tableTypeText)
        tableTypeText.insertAdjacentElement('afterend', hr)
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
        var num = document.createElement("input");
        num.setAttribute("type", "number")
        num.setAttribute("disabled", true)
        num.setAttribute("min", 3)
        num.setAttribute("value", 3)
        num.setAttribute("step", 2)
        final.insertAdjacentElement('afterend', num)
        num.value = 0
        // console.log(final.checked)
        final.addEventListener('change', function (event) {
            if (final.checked == true) {
                num.value = 3;
                num.removeAttribute("disabled")
            }
            else if (final.checked == false) {
                num.setAttribute("disabled", true)
                num.value = 0
            }
        })

        btnStart.addEventListener('click', function (event) {
            if (playerTwo.value != "" && playerOne.value != "") {
                status = "Occupied - Single"
                ipc.send('start-game-single', tableNumber, playerOne.value, playerTwo.value, num.value, startTime.value, status)
                if (win) {
                    win.webContents.send('start-single-game', playerOne.value, playerTwo.value, num.value, startTime.value, "single");
                    ipc.on('message', (event, message) => { console.log(message); });
                }
                remote.getCurrentWindow().close()
            }
            else if (playerTwo.value == "" || playerOne.value == "") {
                ipc.send('empty-single-game')
                playerOne.focus()
            }
        })
    }
    else if (selectedValue == 'double') {
        // CREATING INPUT TAGS FOR Team 1 AND Team 2
        var body = document.getElementById("body");
        var tableTypeText = document.createElement("h1")
        var final = document.createElement("input");
        final.setAttribute("type", "checkbox")
        var finalLabel = document.createElement("p")
        finalLabel.innerHTML = "Final"
        tableTypeText.innerHTML = "Table Type : Double"
        var br0 = document.createElement("br");
        var teamHead = document.createElement("p");
        var teamOneText = document.createTextNode("Team One");
        teamHead.appendChild(teamOneText);
        var br1 = document.createElement("br");
        var playerOne = document.createElement("input");
        playerOne.placeholder = "Player One";
        var vsTextSpn = document.createElement("span");
        var vsText = document.createTextNode(" Teamed up with ");
        vsTextSpn.appendChild(vsText);
        var playerTwo = document.createElement("input");
        playerTwo.placeholder = "Player Two"
        //TEAM TWO
        var br2 = document.createElement("br");
        var teamTwoHead = document.createElement("p");
        var teamTwoText = document.createTextNode("Team Two");
        teamTwoHead.appendChild(teamTwoText);
        var br3 = document.createElement("br");
        var t2playerOne = document.createElement("input");
        t2playerOne.placeholder = "Player One";
        var vs1TextSpn = document.createElement("span");
        var vs1Text = document.createTextNode(" Teamed up with ");
        vs1TextSpn.appendChild(vs1Text);
        var t2playerTwo = document.createElement("input");
        t2playerTwo.placeholder = "Player Two"
        brak1 = document.createElement("br");
        var brak3 = document.createElement("br");
        var Text1 = document.createTextNode("Start Time");
        var startTime = document.createElement("input");
        var d = new Date();
        var n = d.toLocaleTimeString();
        startTime.value = n;
        var btnStart = document.createElement("button");
        btnStart.setAttribute('content', 'Start Game Time');
        btnStart.innerHTML = 'Start Game Time'
        var newbody = document.createElement("div");
        newbody.id = "body";
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


        var num = document.createElement("input");
        num.setAttribute("type", "number")
        num.setAttribute("disabled", true)
        num.setAttribute("min", 3)
        num.setAttribute("value", 3)
        num.setAttribute("step", 2)
        final.insertAdjacentElement('afterend', num)
        num.value = 0

        // console.log(final.checked)
        final.addEventListener('change', function (event) {
            if (final.checked == true) {
                num.value = 3;
                num.removeAttribute("disabled")
            }
            else if (final.checked == false) {
                num.setAttribute("disabled", true)
                num.value = 0
            }
        })
        btnStart.addEventListener('click', function (event) {
            if (playerTwo.value != "" && playerOne.value != "" && t2playerTwo.value != "" && t2playerOne.value != "") {
                status = "Occupied - Double"
                ipc.send('start-game-double', tableNumber, playerOne.value, playerTwo.value, t2playerOne.value, t2playerTwo.value, num.value, startTime.value, status)
                if (win) {
                    win.webContents.send('start-single-game', playerOne.value, playerTwo.value, num.value, startTime.value, "double");
                    ipc.on('message', (event, message) => { console.log(message); });
                }
                remote.getCurrentWindow().close()
            }
            else if (playerTwo.value == "" || playerOne.value == "" || t2playerOne.value == "" || t2playerTwo.value == "") {
                ipc.send('empty-single-game')
                playerOne.focus()
            }
        })

        btnStart.addEventListener('click', function (event) {
            event.preventDefault();
            console.log(playerOne.value);
            console.log(playerTwo.value);
            console.log(startTime.value);
        })

    }
    else if (selectedValue == 'century') {
        let count = 2
        // CREATING INPUT TAGS FOR PLAYER 1 AND PLAYER 2
        var body = document.getElementById("body");
        var tableTypeText = document.createElement("h1")
        tableTypeText.innerHTML = "Table Type : Century"
        var brak = document.createElement("br");
        var playerOne = document.createElement("input");
        playerOne.placeholder = "Player 1";
        var vsTextSpn = document.createElement("span");
        var vsText = document.createTextNode("     VS     ");
        vsTextSpn.appendChild(vsText);
        var playerTwo = document.createElement("input");
        playerTwo.placeholder = "Player 2";
        brak1 = document.createElement("br");
        var brak3 = document.createElement("br");
        var Text1 = document.createTextNode("Start Time");
        var startTime = document.createElement("input");
        var d = new Date();
        var n = d.toLocaleTimeString();
        startTime.value = n;
        var btnStart = document.createElement("button");
        var addPlayer = document.createElement("button");
        addPlayer.innerHTML = 'Add Player'
        btnStart.setAttribute('content', 'Start Game Time');
        btnStart.innerHTML = 'Start Game Time'
        var newbody = document.createElement("div");
        newbody.id = "body";
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

        addPlayer.addEventListener('click', function (event) {
            count = count + 1;
            player = document.createElement("input");
            player.placeholder = "Player " + count;
            playerTwo.insertAdjacentElement('afterend', player)
        })

        btnStart.addEventListener('click', function (event) {
            if (playerTwo.value != "" && playerOne.value != "") {
                status = "Occupied - Century"
                ipc.send('start-game-century', tableNumber, playerOne.value, playerTwo.value, null, startTime.value, status)
                if (win) {
                    win.webContents.send('start-single-game', playerOne.value, playerTwo.value, null, startTime.value, "century");
                    ipc.on('message', (event, message) => { console.log(message); });
                    remote.getCurrentWindow().close()
                }
            }
            else if (playerTwo.value == "" || playerOne.value == "") {
                ipc.send('empty-single-game')
                playerOne.focus()

            }
        })
    }

}

//    function hello(){
//    if(remote.getGlobal('sharedObj').game==='single'){
//      document.getElementById('p1').innerHTML="Player 1: "+remote.getGlobal('sharedObj').player1
//      document.getElementById('p2').innerHTML="Player 2: "+remote.getGlobal('sharedObj').player2
//      document.getElementById('final').innerHTML="Final: "+remote.getGlobal('sharedObj').final
//      document.getElementById('startTime').innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
//    }
//    else if(remote.getGlobal('sharedObj').game==='double'){  
//      document.getElementById('p1').innerHTML="Player 1: "+remote.getGlobal('sharedObj').player1
//      document.getElementById('p2').innerHTML="Player 2: "+remote.getGlobal('sharedObj').player2
//      document.getElementById('final').innerHTML="Final: "+remote.getGlobal('sharedObj').final
//      document.getElementById('startTime').innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
//    }
//    else{
//     var body=document.getElementById("body");
//     var tableTypeText=document.createElement("h1")
//     tableTypeText.innerHTML="Start Time: "+remote.getGlobal('sharedObj').start
//     var br0 =document.createElement("br");
//    var teamHead= document.createElement("p");
//    var teamOneText=document.createTextNode("Team One");
//     teamHead.appendChild(teamOneText);
//     var br1 =document.createElement("br");
//     var vsTextSpn=document.createElement("span");
//     var vsText=document.createTextNode(" Teamed up with ");
//     vsTextSpn.appendChild(vsText);
//     //TEAM TWO
//     var br2=document.createElement("br");
//     var teamTwoHead= document.createElement("p");
//      var teamTwoText=document.createTextNode("Team Two");
//      teamTwoHead.appendChild(teamTwoText);
//     var br3 =document.createElement("br");
//     var vs1TextSpn=document.createElement("span");
//     var vs1Text=document.createTextNode(" Teamed up with ");
//     vs1TextSpn.appendChild(vs1Text);
//     brak1 =document.createElement("br");
//     var brak3 =document.createElement("br");
//      var Final=document.createTextNode("Final: "+remote.getGlobal('sharedObj').final);
//     var btnStart=document.createElement("button");
//     btnClose.setAttribute('content', 'End Game');
//     btnClose.innerHTML = 'End Game'
//     var newbody = document.createElement("div");
//     newbody.id="body";
//     newbody.appendChild(tableTypeText)
//     newbody.appendChild(br0);
//     newbody.appendChild(teamHead);
//     newbody.appendChild(br1);
//     newbody.appendChild(br2);
//     newbody.appendChild(teamTwoHead);
//     newbody.appendChild(br3);
//     newbody.appendChild(brak1);
//     newbody.appendChild(Final);
//     newbody.appendChild(brak3)
//     newbody.appendChild(btnClose)
//     body.replaceWith(newbody)
//    }
// }

// AddExtrasPlayer1 = document.getElementById("extrasP1")
// AddExtrasPlayer1.addEventListener('click',function(event){
//     var body=document.getElementById("body");
//     var tableTypeText=document.createElement("h1")
//     tableTypeText.innerHTML="Player Name: "+remote.getGlobal('sharedObj').player1
//     var br0 =document.createElement("br");
//    var teamHead= document.createElement("p");
//    var Cigarettes=document.createTextNode("Cigarettes");
//     teamHead.appendChild(Cigarettes);
//     var addCig=document.createElement("button");
//     addCig.innerHTML = 'Add'

//     var br1 =document.createElement("br");
//     var vsTextSpn=document.createElement("span");
//     var vsText=document.createTextNode(" Teamed up with ");
//     vsTextSpn.appendChild(vsText);
//     //TEAM TWO
//     var br2=document.createElement("br");
//     var teamTwoHead= document.createElement("p");
//      var teamTwoText=document.createTextNode("Kitchen");
//      teamTwoHead.appendChild(teamTwoText);
//      var addKitchen=document.createElement("button");
//      addKitchen.innerHTML = 'Add'
//     var br3 =document.createElement("br");
//     var vs1TextSpn=document.createElement("span");
//     var vs1Text=document.createTextNode(" Teamed up with ");
//     vs1TextSpn.appendChild(vs1Text);
//     brak1 =document.createElement("br");
//     var brak3 =document.createElement("br");
//      var Final=document.createTextNode("Miscalleniuos");
//     var btnClose=document.createElement("button");
//     btnClose.setAttribute('content', 'Add Extras');
//     btnClose.innerHTML = 'Add Extras'
//     var newbody = document.createElement("div");
//     newbody.id="body";
//     newbody.appendChild(tableTypeText)
//     newbody.appendChild(br0);
//     newbody.appendChild(teamHead);
//     newbody.appendChild(addCig);
//     newbody.appendChild(br1);
//     newbody.appendChild(br2);
//     newbody.appendChild(teamTwoHead);
//     newbody.appendChild(addKitchen);
//     newbody.appendChild(br3);
//     newbody.appendChild(brak1);
//     newbody.appendChild(Final);
//     newbody.appendChild(brak3)
//     newbody.appendChild(btnClose)
//     body.replaceWith(newbody)

//     let cig = [];
//     let kitchen = [];
//     kitchenAmount = []
//     let kitchenCount= 0;
//     let count= 0;

//     let game = remote.getGlobal('sharedObj').game
//     let player1 = remote.getGlobal('sharedObj').player1
//     let player2 = remote.getGlobal('sharedObj').player2
//     let tableNumber = remote.getGlobal('sharedObj').tableNumber
//     let final = remote.getGlobal('sharedObj').final
//     let startTime = remote.getGlobal('sharedObj').start


//         addCig.addEventListener('click',function(event){
//             cig=document.createElement("input");
//             cig.placeholder="Cigarette "+count;
//             addCig.insertAdjacentElement('beforebegin',cig)
//             count=count+1;
//         })

//         addKitchen.addEventListener('click',function(event){
//             kitchen[kitchenCount]=document.createElement("input");
//             kitchen[kitchenCount].placeholder="Kitchen "+kitchenCount;

//             kitchenAmount[kitchenCount]=document.createElement("input");
//             kitchenAmount[kitchenCount].placeholder="Amount";
//             addKitchen.insertAdjacentElement('beforebegin',kitchen[kitchenCount])
//             addKitchen.insertAdjacentElement('beforebegin',kitchenAmount[kitchenCount])
//             kitchenCount=kitchenCount+1;
//         })

//         btnClose.addEventListener('click',function(event){
//             console.log(remote.getGlobal('sharedObj').player1)
//             console.log(remote.getGlobal('sharedObj').player2)
//             console.log(remote.getGlobal('sharedObj').tableNumber)
//             console.log(remote.getGlobal('sharedObj').game)
//             for(var i=0;i<kitchenCount;i++)
//             {
//                 ipc.send('add-order',kitchen[i].value,kitchenAmount[i].value,player1,player2,startTime, final, game, tableNumber)
//             }
//             remote.getCurrentWindow().reload()

//         })
// })