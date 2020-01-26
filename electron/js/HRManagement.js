require('datatables.net-dt')();

function openModal(modalName)
{
    // Get the modal
    var modal = document.getElementById(modalName);
    modal.style.display = "block";
    var close=modalName+'Close'
    // Get the <span> element that closes the modal
    var span = document.getElementById(close);
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () 
    {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
      }
    }
}

function addEmployee()
{

}

function addSalary()
{
    
}

function addAdvance()
{
    
}

var data = [];
var jsonData = [{
        FirstName: "1-06-2020",
        LastName: "2000",
        Post: "200",
        Phone: "5600",
        Address: "24000",
        BasicPay: "22000",
        Advance: "250"
    },
    {
      FirstName: "1-06-2020",
      LastName: "2000",
      Post: "200",
      Phone: "5600",
      Address: "24000",
      BasicPay: "22000",
      Advance: "250"
    },
    {
      FirstName: "1-06-2020",
      LastName: "2000",
      Post: "200",
      Phone: "5600",
      Address: "24000",
      BasicPay: "22000",
      Advance: "250"

    }



]
for (let i = 0; i < jsonData.length; i++) {
    data.push(jsonData[i])
}

console.log(data)

$(document).ready(function () {
    $('#example').dataTable({
        data: data,
        "columns": [{
                data: "FirstName"
            },
            {
                data: "LastName"
            },
            {
                data: "Post"
            },
            {
                data: "Phone"
            },
            {
                data: "Address"
            },
            {
                data: "BasicPay"
            },
            {
                data: "Advance"
            }
        ]
    })
});