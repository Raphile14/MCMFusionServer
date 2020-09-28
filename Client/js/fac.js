const socket = io();

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getEntries", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill"]});

function buttonPres (name) {
    if (name == 1) {
        if (document.getElementById("b1").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-success";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            socket.emit("getEntries", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill"]});
        }        
    }
    else if (name == 2) {
        if (document.getElementById("b2").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-success";
            document.getElementById("b3").className = "btn btn-primary";
            socket.emit("getEntries", {list: ["COLLEGE MCMFlicks and Chill"]});
        }        
    }
    else if (name == 3) {
        if (document.getElementById("b3").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-success";
            socket.emit("getEntries", {list: ["SHS MCMFlicks and Chill"]});
        }        
    }
}

socket.on('receiveEntries', function(data) {
    console.log(data);
    let entries = document.getElementById('entries');
    entries.innerHTML = '';    
    let newHTML = '';
    for (let x in data.data) {
        newHTML += '<div id="outer" class="text-center grid-item"> <br>';
        newHTML += '<iframe src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        newHTML += '<p> ' + data.data[x].name;
        newHTML += '</p> <br>';
        newHTML += '</div>';
        console.log(data.data[x]);
    }
    entries.innerHTML = newHTML;
})