const socket = io();

let storage = [];
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getEntries", {list: ["SHS Show Stopper", "COLLEGE Show Stopper"]});

function buttonPres () {
    let status = true;
    let scores = [];
    let name = document.getElementById('inputName').value;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById('inputName').style.borderColor = 'green';
    if (name.length == 0) {
        status = false;
        document.getElementById('inputName').style.borderColor = 'red';
    }
    for (let x in storage) {     
        let team = storage[x][0];
        let department = storage[x][1].split(' ')[0];
        let choreography = document.getElementById(team+'0').value;
        let execution = document.getElementById(team+'1').value;
        let costume = document.getElementById(team+'2').value;
        let crowd_favorite = document.getElementById(team+'3').value;
        document.getElementById(team+'0').style.borderColor = 'green';
        if (choreography.length == 0 || choreography > 20 || choreography < 0) {
            status = false;
            document.getElementById(team+'0').style.borderColor = 'red';
        }
        document.getElementById(team+'1').style.borderColor = 'green';
        if (execution.length == 0 || execution > 20 || execution < 0) {
            status = false;
            document.getElementById(team+'1').style.borderColor = 'red';
        }
        document.getElementById(team+'2').style.borderColor = 'green';
        if (costume.length == 0 || costume > 20 || costume < 0) {
            status = false;
            document.getElementById(team+'2').style.borderColor = 'red';
        }
        document.getElementById(team+'3').style.borderColor = 'green';
        if (crowd_favorite.length == 0 || crowd_favorite > 10 || crowd_favorite < 0) {
            status = false;
            document.getElementById(team+'3').style.borderColor = 'red';
        }
        let score = parseInt(team) + parseInt(choreography) + parseInt(execution) + parseInt(costume) + parseInt(crowd_favorite);
        scores.push({name, department, team, choreography, execution, costume, crowd_favorite, date});        
    }
    if (status) {
        socket.emit('ss_judge', scores);
        document.getElementById('b3').disabled = true;
        alert("Scores delivered!");
    }
    else {
        alert("Please check input!");
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
        newHTML += '    <p> ' + data.data[x].name + '</p>';
        newHTML += '    <div class="grid-container text-center">'
        newHTML += '        <div class="grid-item">';        
        newHTML += '            <iframe src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        newHTML += '        </div>';
        newHTML += '        <div class="grid-item">'; 
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '0" aria-describedby="nameHelp" placeholder="Choreography" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '1" aria-describedby="nameHelp" placeholder="Execution and Editing" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '2" aria-describedby="nameHelp" placeholder="Costume" required>';            
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '3" aria-describedby="nameHelp" placeholder="Crowd Favorite" required>';        
        newHTML += '        </div>';
        newHTML += '    </div>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})