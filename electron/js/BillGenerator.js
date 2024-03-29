require('datatables.net-dt')();
var modal = document.getElementById("myModal");
var mainBody= document.getElementById("Fade");
var billData=[],billIdArray=[],datatable,totalBill=0;
function renderSuggestions()
{
        autoComplete("PlayerName", allplayers)
}

//Autocomplete Customer Name Field
function autoComplete(input, allplayers) {
    var inp = document.getElementById(input);
    console.log(inp)
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var listContainerDiv, elementContainerDiv, i;
        var val = this.value;
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
        for (i = 0; i < allplayers.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (allplayers[i].customerName.substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                /*create a DIV element for each matching element:*/
                elementContainerDiv = document.createElement("DIV");
                /*make the matching letters bold:*/
                elementContainerDiv.innerHTML = "<strong>" + allplayers[i].customerName.substr(0, val.length) + "</strong>";
                elementContainerDiv.innerHTML += allplayers[i].customerName.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                elementContainerDiv.innerHTML += "<input type='hidden' value='" + allplayers[i].customerName + "'>";
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

//Render Modal
function modalScript() {
    // Get the modal
    var modal = document.getElementById("myModal");
    var mainBody= document.getElementById("Fade");
    mainBody.style.display = "none";
    modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        mainBody.style.display = "block";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            mainBody.style.display = "block";
        }
    }



}

function generateBill()
{
    totalBill=0
    customerName= $('#PlayerName').val()
    currentPlayerId = getId(customerName)
    ipc.send('generate-bill',currentPlayerId);
    ipc.once('generated-bill', (event, bill) => 
    {
        billData=[]
        billIdArray=[]
        for (let i = 0; i < bill.length; i++) {
            billData.push(bill[i])
            billIdArray.push(bill[i].billId)
            totalBill+=bill[i].price;
        }
        datatable.clear().rows.add(billData).draw();
        // $("#totalBill").innerText(totalBill+ " PKR")
        $("#totalBill").html(totalBill+ " PKR")
        $("#totalBill1").val(totalBill)
    })

}
$(document).ready(function () {
    datatable=$('#example').DataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
        data: billData,
        "columns": [{
                data: "item"
            },
            {
                data: "time_quantity"
            },
            {
                data: "price"
            }

        ]
    })
    
});

function getId(name)
{
    for(var i=0; i<allplayers.length;i++)
    {
        if(allplayers[i].customerName===name)
        {
            return allplayers[i].customerId
        }
    }
    return null;
}

function amountReceived()
{
    modal.style.display="none";
    mainBody.style.display="block";
    let cash=parseInt($('#paymentByCash').val());
    let card=parseInt($('#paymentByCard').val())
    let ep=parseInt($('#paymentByEasyPaisa').val())
    let discount=parseInt($('#discount').val())
    console.log(cash)
    if(cash==='')
    {
        cash=0
    }
    else if(card==='')
    {
        card=0
    }
    else if(ep==='')
    {
        ep=0
    }
    else if(discount==='')
    {
        discount=0
    }
    let bill=totalBill-discount;
    let received=cash+card+ep;
    let remaining=bill-received;
    if(remaining==0)
    {
        ipc.send('pay-bill',cash,card,ep,discount,"paid",0,currentPlayerId,...billIdArray)
    }
    else
    {
        remaining=bill-received;
        ipc.send('pay-bill',cash,card,ep,discount,"Partial Paid",remaining,currentPlayerId,...billIdArray)
    }
}