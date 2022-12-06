let socket = io("/publicSpace");

socket.on("connect", ()=>{
    console.log("Connection established to server via socket");
});

let strokesize=5;
let slider;

window.addEventListener('load',()=>{
    // strokesize = document.getElementById('myRange').value;
    slider = document.getElementById('myRange');
    slider.addEventListener('change', ()=>{
        strokesize = document.getElementById('myRange').value;
    })
    let button = document.getElementById('paint-button');
    console.log(button);
    button.addEventListener('click', ()=>{
        socket.on("serverData", (data)=>{
            drawPaint(data);    
        })
    })    

    let buttonErase = document.getElementById('erase-button');
    buttonErase.addEventListener('click', ()=>{
        socket.on("serverData", (data)=>{
            erasePaint(data);    
        })
    })    

})
// socket.on("serverData", (data)=>{
//     drawPaint(data);
// })


function setup (){
    let myCanvas = createCanvas(400,400);
    myCanvas.parent("container");
    background(0);
}

function mouseDragged(){
    // ellipse(mouseX, mouseY, 10);
    let mouseObj = {
        x : mouseX,
        y : mouseY,
        px : pmouseX,
        py : pmouseY
    }
    socket.emit("mouseData", mouseObj)
}

function mouseDraggedErase(){
    let mouseErase = {
        x : mouseX,
        y : mouseY,
        px : pmouseX,
        py : pmouseY
    }
    socket.emit("mouseEarse", mouseErase)
}

function drawPaint(data) {
    line(data.x,data.y,data.px,data.py)
    stroke(255);
    strokeWeight(strokesize);
}

function erasePaint(data){
    line(data.x, data.y,data.px, data.py)
    stroke(0);
    strokeWeight(strokesize);
}