const myinput = document.getElementById('myinput');
const generate = document.getElementById('generate');

const maxNodes = 100;
let N , M;

let edges = [];
for(let i=0;i<=maxNodes;i++){
    edges.push([])
    for(let j=0;j<=maxNodes;j++){
        edges[i].push(0);
    }
}

console.log(generate);
generate.addEventListener('click' , () => {
    
    let inp = myinput.value.split(/\r?\n/);
    console.log(inp);

    for(let i = 0;i <= maxNodes;++i)
        for(let j = 0;j <= maxNodes;++j)
        edges[i][j] = 0;
    

    for (let i = 0;i < inp.length;++i){
        let lineinp = inp[i].split(" ");
        console.log(lineinp);
        
        if(i == 0) {
            N = parseInt(lineinp[0]);
            M = parseInt(lineinp[1]);
        }
        else{
            let u = parseInt(lineinp[0]);
            let v = parseInt(lineinp[1]);
            console.log(u , v);
            edges[u][v] = 1;
            edges[v][u] = 1;
        }
    }
    
    Construction(edges , N , M)
    
})

function sinDegrees(angleDegrees) {
    return Math.sin(angleDegrees*Math.PI/180);
};

function cosDegrees(angleDegrees) {
    return Math.cos(angleDegrees*Math.PI/180);
};


function Reset(nodes , lines){
    
    let root = document.getElementById("root");
    for(let node of nodes)
    root.removeChild(node);

    for(let line of lines)
    root.removeChild(line);

    

}


let nodes = [] , lines = [] , redNode;
let extra , todrag , subx , suby , moved , initialX , initialY , leftpoint;
function Construction(edges , N , M){

    let root = document.getElementById("root");
    let Get = document.getElementById("Get");
    let choice = document.getElementById("choice");
    let compChoice = document.getElementById("compChoice");
    let lp = document.getElementById("leftpoint");


    Reset(nodes , lines);
    nodes = [] , lines = [] , todrag = null , subx = 0 , suby = 0;
    redNode = null;extra = parseInt(compChoice.value);leftpoint = parseInt(lp.value);


    console.log(edges , N , M);
    function DfsComp(p){

        compNodes.push(p);
        for (let i = 1;i <= N;++i){
            if(edges[p][i] == 0) continue;
            if(vis[i]) continue;

            vis[i] = true;
            DfsComp(i);
        }
        
    }

    function make(x , y , no){

        let node = document.createElement('div');
        node.innerText = no;
        node.id = "node" + no;
        node.className = "node";
        node.style.zIndex = "1";
        node.style.position = "absolute"
        node.style.left = x - 25 + "px";
        node.style.top = y - 25 + "px";
        
        nodes.push(node);
        root.appendChild(node);
    }

    function addEdge(node1 , node2 , line){

        let x1 = parseInt(node1.style.left.slice(0,-2)) + 26;
        let y1 = parseInt(node1.style.top.slice(0,-2)) + 26;
        let x2 = parseInt(node2.style.left.slice(0,-2)) + 25;
        let y2 = parseInt(node2.style.top.slice(0,-2)) + 25;

        let distance = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2)) - 50;
        let xMid = (x1+x2)/2;
        let yMid = (y1+y2)/2;
        let angle = (Math.atan2(y1-y2, x1-x2)*180)/Math.PI;

        console.log(distance);
        line.style.width = distance+"px";
        line.style.top = yMid +"px";
        line.style.left = (xMid - (distance / 2)) + "px";
        line.style.transform = "rotate("+angle+"deg)";
        line.style.zIndex = "0";

        root.appendChild(line);

    }


    function makeEdges(){
        lines = [];
        for(let i = 0;i <= N;++i){
            for (let j = i + 1;j <= N;++j){
                if(edges[i][j] == 0) continue;

                let line = document.createElement("div");
                line.style.position = "absolute";
                line.style.height = 2 + "px";
                line.style.backgroundColor = "black";
                line.id = "line" + i + j;
                    
                let node1 = document.getElementById("node" + i);
                let node2 = document.getElementById("node" + j);
                addEdge(node1 , node2 , line);
                    
                lines.push(line);
                console.log(line);

            }
        }
    }
    

    function move(){
        for(let node of nodes){
            
            node.addEventListener('mousedown' , (e) => {

                todrag = node;
                initialX = todrag.style.left;
                initialY = todrag.style.top;
                subx = e.pageX - parseInt(node.style.left.slice(0,-2));
                suby = e.pageY - parseInt(node.style.top.slice(0,-2));
            })
                
            node.addEventListener('click',() => {
                if(moved){
                    moved = false;
                    return;
                }

                if(redNode == null){
                    node.style.backgroundColor = "red";
                    redNode = node;
                }
                else{
                    if(redNode == node){
                        node.style.backgroundColor = "greenyellow";
                    }
                    else{
                            
                        redNode.style.backgroundColor = "greenyellow";

                        let x = parseInt(redNode.innerText) , y = parseInt(node.innerText);
                        let i = (x > y)?y:x;
                        let j = (x > y)?x:y;

                        if(edges[i][j]){
                            let line = document.getElementById("line" + i + j);
                            edges[i][j] = 0;
                            edges[j][i] = 0;

                            let tempLines = []
                            for (let i = 0;i < lines.length;++i){
                                if(lines[i] == line)
                                continue;

                                tempLines.push(lines[i]);
                            }
                            
                            lines = tempLines;
                            console.log(lines)
                            root.removeChild(line);
                        }
                        else{
                            edges[i][j] = 1;
                            edges[j][i] = 1;
                            let line = document.createElement("div");
                            line.style.position = "absolute";
                            line.style.height = 2 + "px";
                            line.style.backgroundColor = "black";
                            line.id = "line" + i + j;
                            addEdge(node , redNode , line);
                            lines.push(line); 
                    }

                }

                redNode = null;

            }
            })

        }
    }

    function dragEdge(node){
        
        for(let i = 0;i <= N;++i){

            let u = parseInt(node.innerText);
            let v = i;
            if(edges[u][v] == 0) continue;
            
            let node1 = document.getElementById("node" + u);
            let node2 = document.getElementById("node" + v);

            let minv = (u < v)?u:v;
            let maxv = (u < v)?v:u;
            let line = document.getElementById("line" + minv + maxv);
            addEdge(node1 , node2 , line);

        }

    }

    document.onmouseup = function(e){
        
        if(todrag){

            let finalX = todrag.style.left;
            let finalY = todrag.style.top;
            if(initialX != finalX || initialY != finalY)
            moved = true;
        }

        todrag = null;
        subx = 0;
        suby = 0;
    }

    document.onmousemove = function(e){
        const x = e.pageX;
        const y = e.pageY;
        if(todrag){
            dragEdge(todrag);
            todrag.style.left = x - subx + "px";
            todrag.style.top = y - suby + "px";
        }
    }

    
    
    Get.addEventListener('click' , () =>{
        let edgesCount = 0;
        let display = "";
        for (let i = 1;i <= maxNodes;++i){
            for(let j = i + 1;j <= maxNodes;++j){
                if(edges[i][j] == 0) continue;
                display = display + i + " " + j + "\n";
                edgesCount += 1;
            }
        }
    
        localStorage["display"] = display;
        localStorage["nodesCount"] = nodes.length;
        localStorage["edgesCount"] = edgesCount;
    })

    



    let vis = []
    for (let i = 0;i <= N;++i)
    vis.push(false);

    let comp = [] , compNodes = [];
    for(let i = 1;i <= N;++i){
        if(vis[i]) continue;
        
        compNodes = [];
        vis[i] = true;
        DfsComp(i);
        comp.push(compNodes);
    }

    console.log(comp);

    let compRadius = [];
    let x = parseInt(choice.value);
    for (let c of comp){
        
        let no = c.length;
        let angle = 360 / no;


        let den = 2 * sinDegrees(angle);
        
        console.log(den);
        let radius
        if(den > 1e-6) radius = x / den;
        else radius = 50

        if(no > 1) compRadius.push(radius);
        else compRadius.push(0);

    }
   
    console.log(compRadius);
    
    let extraTop = 150;
    let prevX = leftpoint - extra;
    let centerX = [] , centerY = []
    for (let i in compRadius){
        let dia = 2 * compRadius[i];
        centerX.push(prevX + compRadius[i] + extra);
        centerY.push(extraTop + compRadius[i]);
        prevX += dia + extra;
    }
    
    
    console.log(centerX);
    console.log(centerY);
    
    
    let index = 0;
    for (let c of comp){
        
        let Angle = 360 / c.length;
        let curAngle = -90;

        for (let node of c){
            let x = compRadius[index] * cosDegrees(curAngle);
            let y = compRadius[index] * sinDegrees(curAngle);

            let cx = x + centerX[index];
            let cy = y + centerY[index];

            make(cx , cy , node)
            curAngle += Angle;
        }

        index ++;
    }

    makeEdges();
    move();
   
    

}