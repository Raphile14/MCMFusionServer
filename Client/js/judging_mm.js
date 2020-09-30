const socket = io();

let storage = [];
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("getMMEntries", {list: ["SHS Mr. Staycation", "SHS Ms. Staycation", "COLLEGE Mr. Staycation", "COLLEGE Ms. Staycation"]});

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
        let creativity = document.getElementById(team+'0').value;
        let poise = document.getElementById(team+'1').value;
        let overall_appearance = document.getElementById(team+'2').value;
        let question_and_answer = document.getElementById(team+'3').value;
        document.getElementById(team+'0').style.borderColor = 'green';
        if (creativity.length == 0 || creativity > 20 || creativity < 0) {
            status = false;
            document.getElementById(team+'0').style.borderColor = 'red';
        }
        document.getElementById(team+'1').style.borderColor = 'green';
        if (poise.length == 0 || poise > 10 || poise < 0) {
            status = false;
            document.getElementById(team+'1').style.borderColor = 'red';
        }
        document.getElementById(team+'2').style.borderColor = 'green';
        if (overall_appearance.length == 0 || overall_appearance > 20 || overall_appearance < 0) {
            status = false;
            document.getElementById(team+'2').style.borderColor = 'red';
        }
        document.getElementById(team+'3').style.borderColor = 'green';
        if (question_and_answer.length == 0 || question_and_answer > 30 || question_and_answer < 0) {
            status = false;
            document.getElementById(team+'3').style.borderColor = 'red';
        }
        let score = parseInt(creativity) + parseInt(poise) + parseInt(overall_appearance) + parseInt(question_and_answer);
        scores.push({name, department, team, creativity, poise, overall_appearance, question_and_answer, date, score});        
    }
    if (status) {
        socket.emit('mm_judge', scores);
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
        newHTML += '    <p>';
        if (data.data[x].poster.length > 0) {
            newHTML += '    <a target="_blank" href="' + data.data[x].poster  + '"> '
        }        
        newHTML +=          data.data[x].name;
        if (data.data[x].poster.length > 0) {
            newHTML += ' </a>';
        }
        newHTML += '    </p>';
        newHTML += '    <div class="grid-container text-center">'
        newHTML += '        <div class="grid-item">';        
        newHTML += '            <iframe src=' + data.data[x].link +' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        newHTML += '        </div>';
        newHTML += '        <div class="grid-item">'; 
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '0" aria-describedby="nameHelp" placeholder="Creativity" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '1" aria-describedby="nameHelp" placeholder="Poise and Projection" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '2" aria-describedby="nameHelp" placeholder="Overall Appearance" required>';        
        newHTML += '            <input type="number" class="form-control" id="' + data.data[x].name + '3" aria-describedby="nameHelp" placeholder="Question and Answer" required>';        
        newHTML += '        </div>';
        newHTML += '    </div>';
        newHTML += '</div>';
    }
    entries.innerHTML = newHTML;
})