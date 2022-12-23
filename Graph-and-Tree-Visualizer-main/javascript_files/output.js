const textbox = document.getElementById("textbox")
let display = localStorage["display"];
let nodesCount = localStorage["nodesCount"];
let edgesCount = localStorage["edgesCount"];


function copy_data(){
    let textboxchild = document.getElementById("textboxchild");
    navigator.clipboard.writeText(textboxchild.innerText);
    alert("data copied to clipboard");
}

let ref = document.getElementById("textboxchild");
if(ref) {
    let copy_ref = document.getElementById("copy_button");
    textbox.removeChild(ref);
    textbox.removeChild(copy_ref);
}

let copy_button = document.createElement("button");
copy_button.id = "copy_button";
copy_button.innerText = "Copy";
copy_button.onclick = copy_data;
textbox.appendChild(copy_button);

let textboxchild = document.createElement("div");
textboxchild.innerText = nodesCount + " " + edgesCount + "\n" + display;
textboxchild.id = "textboxchild";
textbox.appendChild(textboxchild);