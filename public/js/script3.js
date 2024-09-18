const plus = document.querySelector(".plus");
const formdiv = document.querySelector(".newtemplate");
const vanform = document.getElementById("newvan");
const editform = document.getElementById("editform");

plus.addEventListener('click', showform);

function showform() {
    formdiv.classList.remove("hidden");
}

vanform.addEventListener("submit", hideform);
function hideform() {
    alert("Click ok to see newly created van!")
    formdiv.classList.add("hidden");
}
