## [Custom Lockscreen for KDE plasma](https://github.com/txhammer68/Lockscreen)

### Changes made
* Clock remove am/pm
* Added calendar event to clock
* Added current temperature
* Unread gmail message count
* Modified UI to hide status bar/show user login when KB/mouse movement detected
NOTES:
Using systemd to update calendar events and temperature, as kscrenlocker does not allow internet access for security.
  maybe someone with better qml skills could show me a better way in pure qml...
  still a WIP, use at ur own risk!
  
![Image of Lockscreen](https://txhammer68.github.io/docs/images/lockscreen.gif)

## [Plasma Look And Feel Explorer](https://userbase.kde.org/Plasma/Create_a_Look_and_Feel_Package)
  Plasma Look And Feel Explorer is a KDE application that allows you to create your own desktop theme.
  The 'Plasma Look and Feel Explorer' is part of the 'plasma-sdk', install it from your distro repo.
  the advatage of creating your own LnF theme is that you can change things like the lockscreen,logout, 
  and other compenents that are part of the default Breeze LnF theme...Most Lnf themes rely on the Breeze Lnf compenents 
  for their theme. Creating your own theme will allow you to custimize every compenent of the Plasma desktop to your liking.
  Once you create your own theme copy the folders from /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/contents/ 
  to your theme in /home/.local/share/plasma/look-and-feel/"your theme name"/
 
  ![Image of Plasma Look And Feel Explorer](https://i.imgur.com/yPkUl3M.png)


## [Kvantum](https://github.com/tsujan/Kvantum/tree/master/Kvantum) 
Kvantum is widget customizer for KDE, widgets are the controls and drop down menus within Plasma

![Image of kvantum](https://github.com/tsujan/Kvantum/raw/master/Kvantum/screenshots/Default.png?raw=true)

## My plasma setup
{::nomarkdown}

<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {box-sizing: border-box}
body {font-family: Verdana, sans-serif; margin:0}
.mySlides {display: none}
img {vertical-align: middle;}

/* Slideshow container */
.slideshow-container {
  max-width: 900px;
  position: relative;
  margin: auto;
}

/* Next & previous buttons */
.prev, .next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 6px;
  margin-top: -22px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

/* Position the "next button" to the right */
.next {
  right: 20%;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.8);
}

/* Caption text */
.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

/* The dots/bullets/indicators */
.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active, .dot:hover {
  background-color: #717171;
}

/* Fading animation */
.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}

@-webkit-keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}

@keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}

/* On smaller screens, decrease text size */
@media only screen and (max-width: 300px) {
  .prev, .next,.text {font-size: 11px}
}
</style>
</head>
<body>

<div class="slideshow-container">

<div class="mySlides fade">
  <div class="numbertext">1 / 6</div>
  <img src="kde.png" style="width:80%">
  <div class="text">My KDE Customizations</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">2 / 6</div>
  <img src="Screenshot_grub2.png" style="width:80%">
  <div class="text">Grub Boot Menu</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">3 / 6</div>
  <img src="Screenshot_sddm.png" style="width:80%">
  <div class="text">SDDM Login</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">4 / 6</div>
  <img src="Screenshot_20191024_140053.png" style="width:80%">
  <div class="text">Plasma Desktop</div>
</div>
<div class="mySlides fade">
  <div class="numbertext">5 / 6</div>
  <img src="Screenshot_20191024_140320.png" style="width:80%">
  <div class="text">Plasma Info</div>
</div>
<div class="mySlides fade">
  <div class="numbertext">6 / 6</div>
  <img src="Screenshot_20191024_140440.png" style="width:80%">
  <div class="text">Plasma Apps</div>
</div>

<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
<a class="next" onclick="plusSlides(1)">&#10095;</a>

</div>
<br>

<div style="text-align:center">
  <span class="dot" onclick="currentSlide(1)"></span> 
  <span class="dot" onclick="currentSlide(2)"></span> 
  <span class="dot" onclick="currentSlide(3)"></span>
  <span class="dot" onclick="currentSlide(4)"></span>
  <span class="dot" onclick="currentSlide(5)"></span> 
  <span class="dot" onclick="currentSlide(6)"></span> 
</div>

<script>
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
</script>

</body>
</html> 


{:/}


## Ideas for Plasma
* Incorporate Google type notifications into Plasma notifications, sports,news,stocks
  * Using Node JS to get info and notify timer events
* Wallpaper slideshow to use picture metadata exif info to show location/description of photo on wallpaper

