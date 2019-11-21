var leftSection = document.getElementsByClassName("left-section")[0];
var dim = leftSection.getBoundingClientRect();

var draggedFromLeft;
var draggedFromRight;
var offsetLeft = 0;
var offsetTop = 0;


function handleSave() {
  url = window.location.origin;
  let children = leftSection.getElementsByClassName("text-box");
  result = [];
  for (i = 0; i < children.length; i++) {
    let obj = {};
    obj['color'] = children[i].getAttribute('data-color');
    obj['text'] = children[i].value;
    obj['top'] = children[i].getBoundingClientRect().top;
    result.push(obj);
  }
  result.sort((a, b) => { return (a.top - b.top); })
  console.log(result);



  $.post((url + '/result'), { "result": result }, (data) => {
    data = data.data;
    let html = "<center><h2>You have saved:</h2>";
    for (let i = 0; i < data.length; i++) {
      html += `<h2>${data[i]}</h2>`;
    }
    html += '</center>';
    document.getElementsByClassName('container')[0].innerHTML = html;
    document.getElementsByClassName('save')[0].style.display = "none";
  })
}



/* events fired on the draggable target */
document.addEventListener("drag", function (event) {
  console.log(`left: ${event.pageX - offsetLeft}, top: ${event.pageY - offsetTop}`);
}, false);

document.addEventListener("dragstart", function (event) {
  // store a ref. on the draggedFromLeft elem
  event.target.style.opacity = .5;
  if (event.target.parentElement.className == "right-section") {
    draggedFromRight = event.target;
    dimTarget = event.target.getBoundingClientRect();
    offsetLeft = Math.abs(event.pageX - dimTarget.left);
    offsetTop = Math.abs(event.pageY - dimTarget.top);
  } else {
    draggedFromLeft = event.target;
  }
}, false);

document.addEventListener("dragend", function (event) {
  // reset the transparency
  event.target.style.opacity = "";

}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function (event) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function (event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "left-section" && draggedFromRight) {
    event.target.style.background = "#f53f85";

  } else if (event.target.className == "right-section" && draggedFromLeft) {
    event.target.style.background = "#f53f85";
  }

}, false);

document.addEventListener("dragleave", function (event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "left-section" || event.target.parentElement.className == 'left-section') {
    event.target.style.background = "";
  } else if (event.target.className == "right-section" || event.target.parentElement.className == 'right-section') {
    event.target.style.background = "";
  }

}, false);

document.addEventListener("drop", function (event) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  // move draggedFromLeft elem to the selected drop target


  if ((event.target.className == "left-section" || event.target.parentElement.className == 'left-section') && draggedFromRight) {

    if (event.target.className == "left-section") {
      leftSec = event.target;
    } else {
      leftSec = event.target.parentElement;
    }

    copy = draggedFromRight.cloneNode(true);
    copy.style.opacity = "1";
    copy.style.margin = "0";
    copy.style.position = "absolute";
    copy.style.left = (event.pageX - offsetLeft) + "px";
    copy.style.top = (event.pageY - offsetTop) + 'px';

    leftSec.style.background = "";
    leftSec.appendChild(copy);

    draggedFromRight.value = "";
    draggedFromRight = null;

  } else if ((event.target.className == "right-section" || event.target.parentElement.className == 'right-section') && draggedFromLeft) {
    let cls = draggedFromLeft.getAttribute('data-color');
    let rightSec;
    if (event.target.className == "right-section") {
      rightSec = event.target;
    } else {
      rightSec = event.target.parentElement;
    }
    rightSec.style.background = "";
    rightSec.getElementsByClassName(cls)[0].value = "";
    draggedFromLeft.parentNode.removeChild(draggedFromLeft);
    draggedFromLeft = null;

  } else if ((event.target.className == "left-section" || event.target.parentElement.className == 'left-section') && draggedFromLeft) {
    draggedFromLeft = null;
  } else {
    draggedFromRight = null;
  }

}, false);

