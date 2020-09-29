const socket = io();

let storage = [];
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getEntries", {list: ["SHS Vattle of the Vands", "COLLEGE Vattle of the Vands"]});

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
        let music = document.getElementById(team+'0').value;
        let virtual_presence = document.getElementById(team+'1').value;
        let appearance = document.getElementById(team+'2').value;
        let crowd_favorite = document.getElementById(team+'3').value;
        document.getElementById(team+'0').style.borderColor = 'green';
        if (music.length == 0 || music > 20 || music < 0) {
            status = false;
            document.getElementById(team+'0').style.borderColor = 'red';
        }
        document.getElementById(team+'1').style.borderColor = 'green';
        if (virtual_presence.length == 0 || virtual_presence > 20 || virtual_presence < 0) {
            status = false;
            document.getElementById(team+'1').style.borderColor = 'red';
        }
        document.getElementById(team+'2').style.borderColor = 'green';
        if (appearance.length == 0 || appearance > 20 || appearance < 0) {
            status = false;
            document.getElementById(team+'2').style.borderColor = 'red';
        }
        document.getElementById(team+'3').style.borderColor = 'green';
        if (crowd_favorite.length == 0 || crowd_favorite > 30 || crowd_favorite < 0) {
            status = false;
            document.getElementById(team+'3').style.borderColor = 'red';
        }
        let score = parseInt(music) + parseInt(virtual_presence) + parseInt(appearance) + parseInt(crowd_favorite);
        scores.push({name, department, team, music, virtual_presence, appearance, crowd_favorite, date, score});        
    }
    if (status) {
        socket.emit('vv_judge', scores);
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
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '0" aria-describedby="nameHelp" placeholder="Music" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '1" aria-describedby="nameHelp" placeholder="Virtual Presence and Viewer Interaction" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '2" aria-describedby="nameHelp" placeholder="Appearance, Personality, and Creativity" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '3" aria-describedby="nameHelp" placeholder="Crowd Favorite" required>';        
        newHTML += '        </div>';
        newHTML += '    </div>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})