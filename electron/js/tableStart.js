const { remote } = require('electron');
const electron = require('electron');
let ipc = electron.ipcRenderer;
let players = remote.getGlobal('sharedObj').players;
window.$ = window.jQuery = require('jquery');
let tableNumber = remote.getGlobal('sharedObj').tableNumber
var centuryPlayersCount = 1;
var centuryMaxPlayers = 10;

function selectGame() {
    const selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    const single = document.getElementById("single");
    const double = document.getElementById("double");
    const century = document.getElementById("century");
    const btnStartSingle = document.getElementById("btnStartSingle");
    const btnStartDouble = document.getElementById("btnStartDouble");
    const btnStartCentury = document.getElementById("btnStartCentury");
    setStartTime();
    
    if(selectedValue=='single')
    {
        displayFirstDivOnly(single,double,century);
        let playersCount=2;
        let gameType="single";
        for (let i=1;i<=playersCount;i++)
        {
            // renderSuggestions('#'+gameType+'Player'+i,'#'+gameType+'Players'+i);
            autoComplete(gameType+'Player'+i,players);    
        }
        btnStartSingle.addEventListener('click',function(event)
        {
            compareAndStartGame(gameType,playersCount);
        })
        
    } 
    else  if(selectedValue=='double')
    {
        displayFirstDivOnly(double,century,single);
        let playersCount=4;
        let gameType="double";
        for (let i=1;i<=playersCount;i++)
        {
            // renderSuggestions('#'+gameType+'Player'+i,'#'+gameType+'Players'+i);
            autoComplete(gameType+'Player'+i,players);        
        }
        btnStartDouble.addEventListener('click',function(event)
        {
            compareAndStartGame(gameType,playersCount);
        })
    }
    
    else if (selectedValue == 'century') {
        displayFirstDivOnly(century, single, double);
        autoComplete('centuryPlayer1', players);
        addPlayerCentury();
        removePlayerCentury();
        btnStartCentury.addEventListener('click',function(event)
        {
            compareAndStartGame("century",centuryPlayersCount);
        
        })
    }
    else if (selectedValue == 'Choose') {
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
                '</div>');
        }
        autoComplete('centuryPlayer' + centuryPlayersCount, players);
        //APPENDING REMOVE BUTTON TO LAST CHILD OF THE WRAPPER CLASS
        // $('.removeField').remove();
        // $('<div><button class="removeField">X</button></div>').insertAfter('.playersFieldsWrap');
        if (centuryPlayersCount > 1) {
            $('.removeField').show();
        }
        // $('.playersFieldsWrap div:last-child ').append('<div><button class="removeField">X</button></div>');
        if (centuryPlayersCount == centuryMaxPlayers) {
            $('.btnAddPlayerField').attr("disabled", true);
            $('.btnAddPlayerField').html("Maximum numbers of players added!");
            $('.btnAddPlayerField').css("background-color", "red");
        }

    });


}

// FUNCTION FOR REMOVING A PLAYER 
function removePlayerCentury() {
    //  REMOVING A FIELD BY JQUERY
    $('.removeField').on("click", function (e) {
        //user click on remove text
        e.preventDefault();
        if (centuryPlayersCount > 1) {

            $('.playersFieldsWrap div:last-child').remove(); centuryPlayersCount--;
            $('.btnAddPlayerField').attr("disabled", false);
            $('.btnAddPlayerField').html("Add Player");
            $('.btnAddPlayerField').css("background-color", "#4CAF50");
            if (centuryPlayersCount == 1) {
                $('.removeField').hide();
            }
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

/*
                AUTO-COMPLETE PLAYER NAME SUGGESTION BOX GENERATOR
     This method takes input tag id without '#' and players list as parameters.
          (This method is the alterantive of suggestionRenderer method)

*/
function autoComplete(input, players) {
    var inp = document.getElementById(input);
    console.log(inp)
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var listContainerDiv, elementContainerDiv, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        listContainerDiv = document.createElement("DIV");
        listContainerDiv.setAttribute("id", this.id + "autocomplete-list");
        listContainerDiv.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(listContainerDiv);
        /*for each item in the array...*/
        for (i = 0; i < players.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (players[i].customerName.substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                /*create a DIV element for each matching element:*/
                elementContainerDiv = document.createElement("DIV");
                /*make the matching letters bold:*/
                elementContainerDiv.innerHTML = "<strong>" + players[i].customerName.substr(0, val.length) + "</strong>";
                elementContainerDiv.innerHTML += players[i].customerName.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                elementContainerDiv.innerHTML += "<input type='hidden' value='" + players[i].customerName + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                elementContainerDiv.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                listContainerDiv.appendChild(elementContainerDiv);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

//Compare All Names in fields and Start Game if No error arises
function compareAndStartGame(gameType,playersCount)
{
    players = remote.getGlobal('sharedObj').players;
    playersArray=[]
    let currentPlayers=[]
    for (let i=1;i<=playersCount;i++)
    {
        let field='#'+gameType+'Player'+i;
        let fieldValue=$(field).val();
        if(fieldValue.length=== 0)
        {
            $(field).focus();
            ipc.send('error-dialog',"Please Enter Player "+i);
            return;
        }
        else
        {
            const player=players.filter(player => (player.customerName === (fieldValue)));
            if(player.length<1)
            {
                $(field).focus();
                ipc.send('error-dialog',"Player "+i+" not in Database");
                return;
            }
            else
            {
                if (playersArray.indexOf(player[0].customerId) !== -1) 
                {
                    $(field).focus();
                    ipc.send('error-dialog',"Player "+i+" is the same as Player "+(playersArray.indexOf(player[0].customerId)+1));
                    return;
                }
                else
                {
                    playersArray.push(player[0].customerId);
                    currentPlayers.push(player[0])
                }
                
            }
        }
    }
    
    for(let i=0;i<currentPlayers.length;i++)
    {
        remote.getGlobal('sharedObj').currentPlayers.push(currentPlayers[i]);
        players=players.filter(currentPlayer => (currentPlayer !== currentPlayers[i]));
    }
    remote.getGlobal('sharedObj').players=players;
    for(let i=playersArray.length;i<=9;i++)
    {
        playersArray.push(null);
    }
    const status="ongoing";
    const today = new Date();
    const startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    if(gameType==="single")
    {
        gameType="Single"
    }
    else if(gameType==="double")
    {
        gameType="Double"
    }
    else if(gameType==="century")
    {
        gameType="Century"
    }
    ipc.send('start-game',tableNumber,status,gameType,...playersArray,startTime,createDate)
    remote.getCurrentWindow().close()
                    
}



