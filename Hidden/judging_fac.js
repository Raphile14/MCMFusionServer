const socket = io();

let storage = [];
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getEntries", {list: ["SHS MCMFlicks and Chill", "COLLEGE MCMFlicks and Chill"]});

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
        let content = document.getElementById(team+'0').value;
        let creativity = document.getElementById(team+'1').value;
        let resourcefulness = document.getElementById(team+'2').value;
        let performance = document.getElementById(team+'3').value;
        document.getElementById(team+'0').style.borderColor = 'green';
        if (content.length == 0 || content > 20 || content < 0) {
            status = false;
            document.getElementById(team+'0').style.borderColor = 'red';
        }
        document.getElementById(team+'1').style.borderColor = 'green';
        if (creativity.length == 0 || creativity > 20 || creativity < 0) {
            status = false;
            document.getElementById(team+'1').style.borderColor = 'red';
        }
        document.getElementById(team+'2').style.borderColor = 'green';
        if (resourcefulness.length == 0 || resourcefulness > 20 || resourcefulness < 0) {
            status = false;
            document.getElementById(team+'2').style.borderColor = 'red';
        }
        document.getElementById(team+'3').style.borderColor = 'green';
        if (performance.length == 0 || performance > 30 || performance < 0) {
            status = false;
            document.getElementById(team+'3').style.borderColor = 'red';
        }
        let score = parseInt(content) + parseInt(creativity) + parseInt(resourcefulness) + parseInt(performance);
        scores.push({name, department, team, content, creativity, resourcefulness, performance, date, score});        
    }
    if (status) {
        socket.emit('fac_judge', scores);
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
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '0" aria-describedby="nameHelp" placeholder="Content, Production, and Editing" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '1" aria-describedby="nameHelp" placeholder="Creativity" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '2" aria-describedby="nameHelp" placeholder="Resourcesfulness" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '3" aria-describedby="nameHelp" placeholder="Performance" required>';        
        newHTML += '        </div>';
        newHTML += '    </div>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})