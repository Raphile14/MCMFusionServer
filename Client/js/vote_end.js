const socket = io();
// let cacheData = [];

socket.on("connectedUsers", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

// socket.emit("get", {type: "SHS"});

// function get(type) {
//     socket.emit("get", {type: type});
// }

// var form = document.getElementById("voteSubmit");
// form.onclick = function() {
//     let emailStatus = true;
//     let nameStatus = true;
//     let voteStatus = true;
//     let data = [];
//     if (document.getElementById('inputEmail').value == "") {
//         document.getElementById('emailHelp').textContent = "Error! Email may be invalid, pending, or already used. Please try again in a minute if this is your first time.";
//         document.getElementById('emailHelp').style.color = "red";
//         emailStatus = false;
//     }
//     else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('inputEmail').value))) {
//         document.getElementById('emailHelp').textContent = "Invalid email structure!";
//         document.getElementById('emailHelp').style.color = "red";
//         emailStatus = false;
//     }
//     if (document.getElementById('inputName').value == "") {
//         document.getElementById('nameHelp').textContent = "Invalid name input!";
//         document.getElementById('nameHelp').style.color = "red";
//         nameStatus = false;
//     }
//     for (x in cacheData[0]) {
//         let radios = document.getElementsByName(cacheData[0][x]);
//         for (let i = 0; i < radios.length; i++) {
//             if (radios[i].checked) {
//                 data.push({category: cacheData[0][x], team: radios[i].value});
//                 break;
//             }
//             else if (i == radios.length - 1) {
//                 voteStatus = false;
//             }
//         }
//     }
//     if (!voteStatus) {
//         document.getElementById('voteHelp').textContent = "Please vote for all categories!";
//         document.getElementById('voteHelp').style.color = "red";
//     }
//     // console.log(cacheData);
//     if (emailStatus && nameStatus && voteStatus) {
//         data.unshift(document.getElementById('inputName').value);
//         data.unshift(document.getElementById('inputEmail').value);        
//         socket.emit("submit", {data: data});
//         document.getElementById('emailHelp').textContent = "Success!";
//         document.getElementById('emailHelp').style.color = "green";
//         document.getElementById('nameHelp').textContent = "Success";
//         document.getElementById('nameHelp').style.color = "green";
//         document.getElementById('voteHelp').textContent = "";
//         document.getElementById('voteHelp').style.color = "green";
//     }    
//     console.log(data);    
// }

// socket.on("submitConfirmation", function(data) {
//     if (data.status) {
//         document.getElementById('emailHelp').textContent = "Success! Please check your email. (or spam!)";
//         document.getElementById('emailHelp').style.color = "green";
//         document.getElementById('nameHelp').textContent = "Success! Please check your email. (or spam!)";
//         document.getElementById('nameHelp').style.color = "green";
//         document.getElementById('voteHelp').textContent = "";
//         document.getElementById('voteHelp').style.color = "green";
//     }
//     else {
//         document.getElementById('emailHelp').textContent = "Invalid Email! System cannot detect email! Use another email.";
//         document.getElementById('emailHelp').style.color = "red";
//         document.getElementById('nameHelp').textContent = "Oh no!";
//         document.getElementById('nameHelp').style.color = "red";
//         document.getElementById('voteHelp').textContent = "";
//         document.getElementById('voteHelp').style.color = "red";
//     }
// });

// socket.on("receiveData", function(data){
//     cacheData = data.data;
//     console.log(cacheData);
//     let checklistArea = document.getElementById('checklistArea');
//     checklistArea.innerHTML = '';    

//     let newHTML = '';
//     for (let x in data.data[0]) {
//         newHTML += '<fieldset class="form-group> <div class="row">'
//         newHTML += '<label for="dept" class="col-form-label col-sm-2"> ' + data.data[0][x] + '  </label>';
//         newHTML += '<div class="col-sm-10">';

//         for (let y in data.data[1]) {
//             if (data.data[0][x] == data.data[1][y].category) {
//                 newHTML += '<div class="form-check">';
//                 newHTML += '<input class="form-check-input" type="radio" name="' + data.data[1][y].category + '" id="' + data.data[1][y].name + '" value="' + data.data[1][y].name + '"" required> </input>';
//                 newHTML += '<label class="form-check-label" for="' + data.data[1][y].name + '"> ' + data.data[1][y].name + '</label>'                                
//                 newHTML += '</div>';
//             }
//         }
//         newHTML += '</div>';
//         newHTML += '</div> </fieldset>';
//     }
//     checklistArea.innerHTML = newHTML;
// });
