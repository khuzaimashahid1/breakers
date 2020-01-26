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