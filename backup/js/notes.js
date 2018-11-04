var course = localStorage.getItem('course');

function createNoteCard(name, rating) {
    var div = document.createElement('div');
    var div2 = document.createElement('div');
    var span = document.createElement('span');
    var span2 = document.createElement('span');
    var element = document.getElementById('notes');
 
    div.classList.add("card");
    div.classList.add("hoverable");
    div2.classList.add("card-content");
    span.classList.add("card-title");
    span2.classList.add("card-rating");
    span.innerHTML = name;
 
    // TO be determined with info from firebase (rating)
    // var starRating =
 
    var iTags = []
    for (let i = 0; i < rating; /* i < starRating; */ i++) {
      var j = document.createElement('i');
      j.classList.add('material-icons');
      j.innerHTML = "stars";
      j.style.color = '#fbc02d';
    //   j.classList.add('yellow');
      iTags[i] = j;
    }
 
    div.addEventListener("click", nextPage.bind(null, name));
    div.style.cursor = 'pointer';
 
    div.appendChild(div2);
    div2.appendChild(span);
    for (let i=0; i < iTags.length; i++) {
        div2.appendChild(iTags[i]);
    }
    element.appendChild(div);
}
 
function nextPage() {
    window.location = 'pdfdisplay.html';
}
 
var notes = ["Jolene's CS101 Notes", "Peter's MATH101 Notes", "Tim's MUSI134 Notes"];
var ratings = [5, 4, 2];
for (let i=0; i < notes.length; i++) {
    createNoteCard(notes[i], ratings[i]);
}