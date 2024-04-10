function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

var i = 0;
var txt = 'HTML, CSS, Javascript, C++, C, Python, PHP, Windows, Linux, Blender Animations';
var speed = 75;
var ts = '';

function typeWriter() {
  if (i < txt.length) {
    ts += txt.charAt(i);
    document.getElementById("exp").innerHTML = ts + '|';
    i++;
    setTimeout(typeWriter, speed);
  }
}
      
function animateBackground() {
  let currentAngle = 45;
  let increment = 180 / 1000;

  const interval = setInterval(function() {
    if (currentAngle >= 225) {
      clearInterval(interval);
        setTimeout(reverseAnimation, 10000);
        return;
    }
    for (var i = 0; i < document.getElementsByClassName("bg-page").length; i++) {
			document.getElementsByClassName("bg-page")[i].style.background = `linear-gradient(${currentAngle}deg, #40c9ff, #e81cff)`;
		}
    currentAngle += increment;
  }, 10);
}

function reverseAnimation() {
  let currentAngle = 225;
  let increment = 180 / 1000;

  const interval = setInterval(function() {
    if (currentAngle <= 45) {
      clearInterval(interval);
      setTimeout(animateBackground, 10000);
      return;
    }
		for (var i = 0; i < document.getElementsByClassName("bg-page").length; i++) {
			document.getElementsByClassName("bg-page")[i].style.background = `linear-gradient(${currentAngle}deg, #40c9ff, #e81cff)`;
		}
    currentAngle -= increment;
  }, 10);
}

animateBackground();

typeWriter();

document.addEventListener("scroll", function() {
  var projects = document.getElementById("projects");
  var topnav = document.getElementById("myTopnav");
  var activeBtn = document.querySelector(".topnav .active");
  var topnavRect = topnav.getBoundingClientRect();
  var projectsRect = projects.getBoundingClientRect();
        
  if (topnavRect.bottom >= projectsRect.top && topnavRect.top <= projectsRect.bottom) {
    var buttons = document.querySelectorAll(".topnav a:not(.active)");
    buttons.forEach(function(button) {
      button.style.visibility = "hidden";
    });
  } else {
    var buttons = document.querySelectorAll(".topnav a:not(.active)");
    buttons.forEach(function(button) {
      button.style.visibility = "visible";
    });
  }
});