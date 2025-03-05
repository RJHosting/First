let scrollContainer = document.querySelector(".certificate");
let left = document.getElementById("left");
let right = document.getElementById("right")

scrollContainer.addEventListener("wheel",(evt)=> {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});

left.addEventListener("click",()=>{
    scrollContainer.scrollLeft += 500;
})

right.addEventListener("click",()=>{
    scrollContainer.scrollLeft -= 500;
})