const socket = io();

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});