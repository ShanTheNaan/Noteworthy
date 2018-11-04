var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
    let json = JSON.parse(this.responseText);
    console.log(json);
    for (let i=0; i < json.length; i++) {
        createClass(json[i]);
    }
  }
});

let id = localStorage.getItem('uid');

xhr.open("GET", "/api/courses?auth=123");
xhr.setRequestHeader("auth", id);
xhr.setRequestHeader("cache-control", "no-cache");
xhr.setRequestHeader("postman-token", "e73ba79e-f294-bf44-dac5-b9671bfc07cf");

xhr.send(data);


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

    div.addEventListener("click", nextPage.bind(null, name));
    div.style.cursor = 'pointer';

    div.appendChild(div2);
    div2.appendChild(span);
    element.appendChild(div);

}


function nextPage(name) {
    //var course = document.getElementById
    localStorage.setItem('course', name);
    window.location = 'notes.html';
}
