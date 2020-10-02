const socket = io();

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getJudges", {list: ["Mr. and Ms. Staycation", "MCMFlicks and Chill", "Show Stopper", "Vattle of the Vands"]});

function buttonPres (name) {
    if (name == 1) {
        if (document.getElementById("b1").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-success";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getJudges", {list: ["Mr. and Ms. Staycation", "MCMFlicks and Chill", "Show Stopper", "Vattle of the Vands"]});
        }        
    }
    else if (name == 2) {
        if (document.getElementById("b2").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-success";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getJudges", {list: ["Mr. and Ms. Staycation"]});
        }        
    }
    else if (name == 3) {
        if (document.getElementById("b3").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-success";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getJudges", {list: ["MCMFlicks and Chill"]});
        }        
    }
    else if (name == 4) {
        if (document.getElementById("b4").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-success";
            document.getElementById("b5").className = "btn btn-primary";
            socket.emit("getJudges", {list: ["Show Stopper"]});
        }        
    }
    else if (name == 5) {
        if (document.getElementById("b5").className != "btn btn-success") {
            document.getElementById("b1").className = "btn btn-primary";
            document.getElementById("b2").className = "btn btn-primary";
            document.getElementById("b3").className = "btn btn-primary";
            document.getElementById("b4").className = "btn btn-primary";
            document.getElementById("b5").className = "btn btn-success";
            socket.emit("getJudges", {list: ["Vattle of the Vands"]});
        }        
    }
}

socket.on('receiveJudges', function(data) {
    console.log(data);
    let entries = document.getElementById('entries');
    entries.innerHTML = '';    
    let newHTML = '';
    for (let x in data.data) {
        newHTML += '<div id="outer" class="text-center grid-item"> <br>';
        newHTML += '<img class="judge" src="images/judges/' + data.data[x].link + '"> <br>'
        newHTML += '<h1 style="color: black"> ' + data.data[x].name + '</h1>';
        newHTML += '<h3 class="text-center" style="font-size: 14px"> <i> ' + data.data[x].category + ' </i> </h3>';
        newHTML += '<p class="text-center"> ' + data.data[x].credentials + ' </p> <br>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})