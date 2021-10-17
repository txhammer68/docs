//functions
function classSwicher(){
    slides.forEach(slide => slide.classList.remove("active"))
    points.forEach(point => point.classList.remove("active"))
    slides[active].classList.add("active");
    points[active].classList.add("active");
}

let goNext = () =>{
    active = (active == slides.length - 1) ? 0 : active + 1;
    classSwicher()
}
let goPrev = () =>{
    active = (active == 0) ? slides.length - 1 : active - 1;
    classSwicher()
}


//active is index slider
let active = 0;

// timer is time slides
let timer = 3000;

let slideshow = document.querySelector(".slideshow");
let slides = document.querySelectorAll(".slide");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let points = document.querySelectorAll(".points > span");

let runSlideshow = setInterval(goNext , timer)


//point events

points.forEach((point,index) =>{
    point.addEventListener("click" , e =>{
        active = index;
        classSwicher()
    })
})

//next event
next.addEventListener("click" , e => goNext());
//prev event
prev.addEventListener("click" , e => goPrev());

//mouseOver

slideshow.addEventListener("mouseover" , e =>clearInterval(runSlideshow))

//mouseLeave
slideshow.addEventListener("mouseleave" , e => runSlideshow = setInterval(goNext , timer))