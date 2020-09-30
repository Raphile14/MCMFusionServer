const socket = io();

let storage = [];
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

// Handles Repeated Actions
function show(shown, hidden) {
    document.getElementById(shown).style.display = 'block';
    document.getElementById(hidden).style.display = 'none';
}

function login () {
    let username = document.getElementById("inputName").value;
    let password = document.getElementById("inputPassword").value;
    socket.emit('login', {username, password});
}

socket.on('loginConfirmed', function(){
    socket.emit("getEntriesAdmin", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill", "SHS Show Stopper", "COLLEGE Show Stopper", "SHS Vattle of the Vands", "COLLEGE Vattle of the Vands"]});
    show('platform', 'login');
});

socket.on('loginFailed', function(){
    document.getElementById("inputName").value = '';
    document.getElementById("inputPassword").value = '';
    document.getElementById("inputName").style.borderColor = 'red';
    document.getElementById("inputPassword").style.borderColor = 'red';
    document.getElementById("inputName").placeholder = 'Invalid Credentials!';
    document.getElementById("inputPassword").placeholder = 'Invalid Credentials!';
});

function buttonPres (type) {
    if (type == 'All') {
        socket.emit("getEntriesAdmin", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill", "SHS Show Stopper", "COLLEGE Show Stopper", "SHS Vattle of the Vands", "COLLEGE Vattle of the Vands"]});
    }
    else if (type == 'fac') {
        socket.emit("getEntriesAdmin", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill"]});
    }
    else if (type == 'ss') {
        socket.emit("getEntriesAdmin", {list: ["SHS Show Stopper", "COLLEGE Show Stopper"]});
    }
    else if (type == 'vv') {
        socket.emit("getEntries", {list: ["SHS Vattle of the Vands", "COLLEGE Vattle of the Vands"]});
    }
    else if (type == 'shsFAC') {
        socket.emit("getEntries", {list: ["SHS MCMFlicks and Chill"]});
    }
    else if (type == 'shsSS') {
        socket.emit("getEntries", {list: ["SHS Show Stopper"]});
    }
    else if (type == 'shsVV') {
        socket.emit("getEntries", {list: ["COLLEGE Vattle of the Vands"]});
    }
    else if (type == 'cFAC') {
        socket.emit("getEntries", {list: ["COLLEGE MCMFlicks and Chill"]});
    }
    else if (type == 'cSS') {
        socket.emit("getEntries", {list: ["COLLEGE Show Stopper"]});
    }
    else if (type == 'cVV') {
        socket.emit("getEntries", {list: ["COLLEGE Vattle of the Vands"]});
    }
}

socket.on('receiveEntries', function(data) {
    storage = [];
    let entries = document.getElementById('entries');
    entries.innerHTML = '';    
    let newHTML = '';
    for (let x in data.data) {
        storage.push([data.data[x].name, data.data[x].category]);
        newHTML += '<div id="outer" class="text-left grid-item"> <br>';
        newHTML += '    <p> ' + data.data[x].name + ' (' + data.data[x].total_votes + ')</p>';
        newHTML += '    <div class="grid-container text-center">'
        // newHTML += '        <div class="grid-item">';        
        // newHTML += '            <iframe src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        // newHTML += '        </div>';
        newHTML += '        <div class="grid-item">'; 

        newHTML += '        </div>';
        newHTML += '    </div>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})