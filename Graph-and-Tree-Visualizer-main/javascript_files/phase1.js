const input = document.querySelector('input');
const nodeButton = document.getElementById('makeNodes');
const clearButton = document.getElementById('clear');
const root = document.getElementById('root');
const generate = document.getElementById('generate');
const main_interface = root;

let nodes = document.querySelectorAll('.node');

let maxNodes = 100;
let redNodes = [];
let edges = [];
input.max = 15;

for(let i=0;i<=maxNodes;i++){
    edges.push([])
    for(let j=0;j<=maxNodes;j++){
        edges[i].push(null);
    }
}

nodeButton.addEventListener('click',() => {

    console.log(input.value , input.max);
    input.value = (parseInt(input.value) > parseInt(input.max))?parseInt(input.max):parseInt(input.value); 
    input.value = (parseInt(input.value) > maxNodes - nodes.length)?maxNodes - nodes.length:parseInt(input.value);
    input.value = (parseInt(input.value) > 0)?parseInt(input.value):0;

    const n = parseInt(input.value);
    const m = nodes.length + 1;
    console.log(n,m);

    let start = 550;
    for(let i=0;i<n;i++){
        const node = document.createElement('div');
        node.className = 'node';
        node.innerHTML = i+m;
        node.style.left = `${start + 60*i+30 + 15}px`;
        node.style.top = "30px";
        node.style.zIndex = "1";
        node.style.backgroundColor = "greenyellow";
        main_interface.appendChild(node);
    }
    nodes = document.querySelectorAll('.node');
    move(m);
})


clearButton.addEventListener('click',() => {
    
    let lines = document.querySelectorAll(".line");
    for (let line of lines)
    root.removeChild(line);

    nodes = document.querySelectorAll('.node');
    for(let node of nodes)
    root.removeChild(node);
    
    nodes = [];
    redNodes = [];
    console.log(nodes);
    for(let i = 0;i <= maxNodes;i++){
        for(let j = 0;j <= maxNodes;j++){
            edges[i][j] = null;
        }
    }

})

generate.addEventListener('click' , () => {
    
    let edgesCount = 0;
    let display = "";
    for (let i = 1;i <= maxNodes;++i){
        for(let j = i + 1;j <= maxNodes;++j){
            if(edges[i][j] == null) continue;
            display = display + i + " " + j + "\n";
            edgesCount += 1;
        }
    }

    localStorage["display"] = display;
    localStorage["nodesCount"] = nodes.length;
    localStorage["edgesCount"] = edgesCount;
 
})

let dragValue = null;

let dx=0, dy=0, moving = false, intialX, finalX, intialY, finalY;

function createEdge(node1, node2, line){

    console.log(node1 , node2);
    let x1 = parseInt(node1.style.left.slice(0,-2)) + 26;
    let y1 = parseInt(node1.style.top.slice(0,-2)) + 26;
    let x2 = parseInt(node2.style.left.slice(0,-2)) + 25;
    let y2 = parseInt(node2.style.top.slice(0,-2)) + 25;

    let distance = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2)) - 50;
    let xMid = (x1+x2)/2;
    let yMid = (y1+y2)/2;
    let slopeInRadian = Math.atan2(y1-y2, x1-x2);
    let slopeInDegrees = (slopeInRadian*180)/Math.PI;

    console.log(distance);
    line.style.width = distance+"px";
    line.style.top = yMid +"px";
    line.style.left = (xMid - (distance / 2)) + "px";
    line.style.transform = "rotate("+slopeInDegrees+"deg)";
    line.style.zIndex = "0";
    //edges[key] = line;
}

function dragEdge(node1){
    let ind = parseInt(node1.innerText);
    for(let i=1;i <= maxNodes;i++){
        if(edges[ind][i]!=null){
            createEdge(node1,nodes[i - 1],edges[ind][i]);
        }
    }
}


function move(m){
    for(let i = m - 1;i < nodes.length;i++){
        if(nodes[i] == null) continue;

        //nodes[i] = nodes[i].clone;
        nodes[i].addEventListener('mousedown',(e) => {
            nodes[i].style.position = "absolute";
            dragValue = nodes[i];
            intialX = dragValue.style.left;
            intialY = dragValue.style.top;
            dx = e.pageX - parseInt(nodes[i].style.left.slice(0,-2));
            dy = e.pageY - parseInt(nodes[i].style.top.slice(0,-2));
        })

        nodes[i].addEventListener('click',() => {
            console.log("clicked");
            if(moving){
                moving = false;
                return;
            }
            if(nodes[i].style.backgroundColor=="greenyellow"){
                nodes[i].style.backgroundColor = "red";
                redNodes.push(nodes[i]);
                if(redNodes.length == 2){
                    if(edges[parseInt(redNodes[0].innerText)][parseInt(redNodes[1].innerText)]==null){
                        let line = document.createElement("div");
                        line.className = "line";
                        line.style.position = "absolute";
                        line.style.height = "2px";
                        line.style.backgroundColor = "black";
                        edges[parseInt(redNodes[0].innerText)][parseInt(redNodes[1].innerText)] = line;
                        edges[parseInt(redNodes[1].innerText)][parseInt(redNodes[0].innerText)] = line;
                        createEdge(redNodes[0],redNodes[1],line);
                        root.appendChild(line);
                        //console.log(edges)
                    }
                    else{

                        root.removeChild(edges[parseInt(redNodes[0].innerText)][parseInt(redNodes[1].innerText)])
                        edges[parseInt(redNodes[0].innerText)][parseInt(redNodes[1].innerText)] = null;
                        edges[parseInt(redNodes[1].innerText)][parseInt(redNodes[0].innerText)] = null;
                    }

                    while(redNodes.length){
                        let x = redNodes.pop();
                        x.style.backgroundColor = "greenyellow";
                    }
                }
            }
            else{
                nodes[i].style.backgroundColor = "greenyellow";
                redNodes.pop();
            }
        })
    }
}

document.onmouseup = function(e){
    if(dragValue){
        finalX = dragValue.style.left;
        finalY = dragValue.style.top;
        if(finalX!=intialX || finalY!=intialY){
            moving = true;
        }
        dragValue = null;
        dx = 0;
        dy = 0;
    }
}

document.onmousemove = function(e){
    const x = e.pageX;
    const y = e.pageY;
    if(dragValue){
        dragEdge(dragValue);
        dragValue.style.left = x-dx+"px";
        dragValue.style.top = y-dy+"px";
    }
}

