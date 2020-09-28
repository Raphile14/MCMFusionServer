const socket = io();

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.emit("get", {type: "SHS"});

function get(type) {
    socket.emit("get", {type: type});
}

socket.on("receiveData", function(data){
    let checklistArea = document.getElementById('checklistArea');
    checklistArea.innerHTML = '';    

    let newHTML = '';
    for (let x in data.data[0]) {
        newHTML += '<fieldset class="form-group> <div class="row">'
        newHTML += '<label for="dept" class="col-form-label col-sm-2"> ' + data.data[0][x] + '  </label>';
        newHTML += '<div class="col-sm-10">';

        for (let y in data.data[1]) {
            if (data.data[0][x] == data.data[1][y].category) {
                newHTML += '<div class="form-check">';
                newHTML += '<input class="form-check-input" type="radio" name="' + data.data[1][y].category +'" id="' + data.data[1][y].name + '" value="' + data.data[1][y].name + '"" required> </input>';
                newHTML += '<label class="form-check-label" for="' + data.data[1][y].name + '"> ' + data.data[1][y].name + '</label>'                                
                newHTML += '</div>';
            }
        }
        newHTML += '</div>';
        newHTML += '</div> </fieldset>';
    }
    checklistArea.innerHTML = newHTML;
});