const socket = io();

// Get number of people online
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

// Get data on load page
socket.emit("getTeams");
socket.on("receiveTeams", function(data){
    for (let x in data) {
        let tag = document.createElement("P");
        tag.setAttribute("id", data[x].name);
        // tag.text = "Team " + data[x].name + ": " + data[x].score;
        let text = document.createTextNode("Team " + data[x].name + ": " + data[x].score);
        tag.appendChild(text);
        document.getElementById(data[x].code).appendChild(tag);
    }    
});

// When someone votes
socket.on("current", function(data){
    document.getElementById(data.name).innerHTML = "Team " + data.name + ": " + data.score;
});
