
function createClass(name) {
    var div = document.createElement('div');
    var div2 = document.createElement('div');
    var span = document.createElement('span');
    var element = document.getElementById('classes');

    div.classList.add("card");
    div.classList.add("hoverable");
    div2.classList.add("card-content");
    span.classList.add("card-title");
    span.innerHTML = name;

    div.setAttribute("onclick", "nextPage()");
    div.style.cursor = 'pointer';

    div.appendChild(div2);
    div2.appendChild(span);
    element.appendChild(div);

}

function nextPage() {
    window.location = 'notes.html';
}

var classes = ["CS 2212: Discrete Structures", "CS 2201: Data Structures", "PHYS 1602: Physics 2"];
for (let i=0; i < classes.length; i++) {
    createClass(classes[i]);
}