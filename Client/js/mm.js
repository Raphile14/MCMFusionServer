const socket = io();

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getMMEntries", {list: ["SHS Mr. Staycation", "SHS Ms. Staycation", "COLLEGE Mr. Staycation", "COLLEGE Ms. Staycation"]});

function buttonPres (name) {
    if (name == 1) {
        if (document.getElementById("b1").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-success";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getMMEntries", {list: ["SHS Mr. Staycation", "SHS Ms. Staycation", "COLLEGE Mr. Staycation", "COLLEGE Ms. Staycation"]});
        }        
    }
    else if (name == 2) {
        if (document.getElementById("b2").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-success";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getMMEntries", {list: ["COLLEGE Mr. Staycation"]});
        }        
    }
    else if (name == 3) {
        if (document.getElementById("b3").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-success";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getMMEntries", {list: ["COLLEGE Ms. Staycation"]});
        }        
    }
    else if (name == 4) {
        if (document.getElementById("b4").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-success";
            document.getElementById("b5").className = "btn btn-primary";            
            socket.emit("getMMEntries", {list: ["SHS Mr. Staycation"]});
        }        
    }
    else if (name == 5) {
        if (document.getElementById("b5").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-success";
            socket.emit("getMMEntries", {list: ["SHS Ms. Staycation"]});
        }        
    }
}

socket.on('receiveEntries', function(data) {
    let entries = document.getElementById('entries');
    entries.innerHTML = '';    
    let newHTML = '';
    for (let x in data.data) {
        newHTML += '<div id="outer" class="text-center grid-item"> <br>';
        newHTML += '<iframe src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        newHTML += '<p> ' + data.data[x].name;
        newHTML += '</p> <br>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})