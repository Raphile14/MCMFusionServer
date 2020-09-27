const socket = io();

let storage = [];
let status = false;

function show(self) {
    if (!status) {
        status = true;
        // Hide everything else
        for (let x in storage) {
            if (x != self) {
                document.getElementById(x).style.display = 'none';
            }            
            document.getElementById(x).className = "";
        }
    }
    else {
        status = false;
        // Show everything else
        for (let x in storage) {
            if (x != self) {
                document.getElementById(x).style.display = 'block';
            }            
            document.getElementById(x).className = "col-large col-medium col-small";
        }
    }
}

socket.emit("getEntries");
socket.on("receiveEntries", function(data){
    for (let x in data.categories) {
        storage.push(x);
        // Create Div container
        let div = document.createElement("DIV");
        div.setAttribute("id", x);
        div.className = "col-large col-medium col-small";
        document.getElementById("entries").appendChild(div);        

        // Add show code
        let show = document.createElement("p");        
        show.className = "entryButton description text-center";     
        let a = document.createElement("button");
        a.style.border = "2px solid black";
        // a.style.margin = "0px 90px 40px 90px";
        a.style.height = "80px";
        a.style.width = "500px";
        a.style.color = "black";
        a.className = "description text-center";  
        a.setAttribute("data-toggle", "collapse");
        a.setAttribute("data-target", "#" + x + "a");
        a.setAttribute("type", "button");
        a.setAttribute("role", "button");
        a.setAttribute("aria-expanded", "false");        
        a.setAttribute("aria-controls", "#" + x + "a");        
        a.setAttribute("onclick", "show(" + x + ")");
        let command = document.createTextNode(data.categories[x]);
        a.href = "#" + x + "a";        
        a.appendChild(command);
        show.appendChild(a);
        document.getElementById(x).appendChild(show);

        let div2 = document.createElement("DIV");
        div2.setAttribute("id", x + "a");
        div2.className = "collapse";
        div.appendChild(div2);

    }
    for (let x in data.data) {
        // Create Div container
        let div = document.createElement("DIV");
        div.className = "col-large col-medium col-small";
        document.getElementById(data.categories.indexOf(data.data[x].category) +"a").appendChild(div);

        // Add the name of the team
        let tag = document.createElement("h3");
        tag.style.marginBottom = "30px";
        tag.className = "text-center";
        let text = document.createTextNode(data.data[x].name);
        tag.appendChild(text);
        div.appendChild(tag);

        // Video Embed
        let link = '<iframe width="560" height="315" src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        let video = document.createElement("DIV");
        video.innerHTML = link;
        video.className = "text-center"
        video.style.marginBottom = "50px";
        div.appendChild(video);
    }
});

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

