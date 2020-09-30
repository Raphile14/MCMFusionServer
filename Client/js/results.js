const socket = io();
let container = [];
let ids = [];

// Get number of people online
socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

// Get data on load page
socket.emit("getTeams");
socket.on("receiveTeams", function(data){
    container = [];    
    ids = [];
    for (let x in data) {
        let div = document.createElement("DIV");
        div.className = "grid-item";
        let score = document.createElement("P");
        score.className = "score";
        score.setAttribute("id", data[x].name);
        score.innerHTML = data[x].score;
        let name = document.createElement("P");
        name.innerHTML = data[x].name;        
        div.appendChild(score);
        div.appendChild(name);
        document.getElementById(data[x].code).appendChild(div);
        if (!ids.includes(data[x].code)) {
            container[data[x].code] = [];
            ids.push(data[x].code);
        }
        container[data[x].code].push(data[x].name)
    }
    for (let x in container) {
        let highestNumber = 0;
        let highestElement = '';
        for (let y in container[x]) {
            let docu = document.getElementById(container[x][y]).innerHTML;
            if (parseInt(docu) > highestNumber) {
                highestNumber = docu;
                highestElement = container[x][y];
            }
            // console.log(container[x][y]);            
        }
        for (let z in container[x]) {
            let docu = document.getElementById(container[x][z]);
            if (docu.innerHTML == highestNumber && docu.innerHTML != 0) {
                docu.style.color = '#C12727';
            }
        }
        // console.log(highestElement)
        // console.log(highestNumber)
    }
});

// When someone votes
socket.on("current", function(data){
    document.getElementById(data.name).innerHTML = data.score;
    for (let x in container) {
        let highestNumber = 0;
        let highestElement = '';
        for (let y in container[x]) {
            let docu = document.getElementById(container[x][y]).innerHTML;
            if (parseInt(docu) > highestNumber) {
                highestNumber = docu;
                highestElement = container[x][y];
            }
            // console.log(container[x][y]);            
        }
        for (let z in container[x]) {
            let docu = document.getElementById(container[x][z]);
            if (docu.innerHTML == highestNumber && docu.innerHTML != 0) {
                docu.style.color = '#C12727';
            }
            else {
                docu.style.color = '#263B5B';
            }
        }
    }
});
