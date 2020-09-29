//////////////////////////////////////
// Requirements
//////////////////////////////////////
const express = require('express');
const path = require('path');
const VDatabase = require('./Classes/VoteDatabase.js');
const EReceipt = require('./Classes/EmailReceipt.js');
const urlCrypt = require('url-crypt')(process.env.LINK_SECRET);

//////////////////////////////////////
// CACHES
//////////////////////////////////////
let cacheCategories = [];
let cacheEntries = [];
let shsVoters = [];
let cVoters = [];
let pending_shsVoters = [];
let pending_cVoters = [];
let connectedSockets = [];

//////////////////////////////////////
// Initialization
//////////////////////////////////////
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let VoteDatabase = new VDatabase(cacheCategories, cacheEntries, shsVoters, cVoters);
let EmailReceipt = new EReceipt(urlCrypt);

//////////////////////////////////////
// Custom Classes Initialization
//////////////////////////////////////
VoteDatabase.init();

//////////////////////////////////////
// EXPRESS
//////////////////////////////////////
// Client Use
app.use(express.static(__dirname + '/Client'));

// ROUTES
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'Client', 'index.html'));    
});

// Email Confirmation
app.get('/confirmation/:id/:category/:encryptedLink', function(req, res){    
    let socket = connectedSockets[req.params.id];
    let decryptedData = urlCrypt.decryptObj(req.params.encryptedLink);
    let status = false;
    if (req.params.category == "SHS") {
        if (pending_shsVoters[decryptedData[0]]) {
            status = true;
            delete pending_shsVoters[decryptedData[0]];
        }
    }
    else if (req.params.category == "COLLEGE"){
        if (pending_cVoters[decryptedData[0]]) {
            status = true;
            delete pending_cVoters[decryptedData[0]];
        }
    }
    if (status) {
        socket.emit('submitConfirmation', {status: true}); 
        VoteDatabase.submitVote(decryptedData, io);
    }
    else {
        socket.emit('submitConfirmation', {status: false});
    }
    res.redirect(req.baseUrl + '/confirmation.html');      
});

//////////////////////////////////////
// SOCKET.IO
//////////////////////////////////////
// Variables
let connectedUsers = 0; // counts how many users are connected to the website
// Socket connection
io.on('connection', function(socket){
    connectedSockets[socket.id] = socket;    
    connectedUsers++;

    // Emit Updated Player Count
    io.emit('connectedUsers', {number: connectedUsers});

    // Emit Current Scores and Get Team Names
    socket.on('getTeams', function(){
        let data = [];
        for (let key in cacheEntries) {
            data.push({name: key, score: cacheEntries[key].votes.length, code: cacheEntries[key].data.code});
        }        
        socket.emit('receiveTeams', data);
    });

    // Emit Entries with Videos
    socket.on('getEntries', function(packet){
        // console.log(packet);
        let data = [];
        for (let key in cacheEntries) {
            if (packet.list.includes(cacheEntries[key].data.category)) {
                data.push({name: key, link: cacheEntries[key].data.link});
            }            
        }  
        socket.emit('receiveEntries', {data: data});
        // console.log(data);
    });

    // Emit Teams list
    socket.on("get", function(data){
        let query = [];
        let sortedCategories = [];
        let sortedEntries = [];
        for (let category in cacheCategories) {
            if (cacheCategories[category].includes(data.type)) {
                sortedCategories.push(cacheCategories[category]);
            }
        }
        query.push(sortedCategories);
        for (let entry in cacheEntries) {
            if (cacheEntries[entry].data.category.includes(data.type)) {
                sortedEntries.push({name: entry, category: cacheEntries[entry].data.category});
            }
        }
        query.push(sortedEntries);
        socket.emit('receiveData', {data: query})
    });

    // Receive Vote
    socket.on("submit", function(data){
        let status = true;
        // console.log(data)
        for (let x = 2; x < data.data.length; x++) {
            if (data.data[x].category.includes("SHS")) {
                if (shsVoters.includes(data.data[0])) {
                    status = false;
                    break;
                }
            }
            else if (data.data[x].category.includes("COLLEGE")) {
                if (cVoters.includes(data.data[0])) {
                    status = false;
                    break;
                }
            }
        }        
        if (!status) {
            socket.emit('submitConfirmation', {status: false})
        }
        else {
            if (data.data[2].category.includes("COLLEGE")) {
                if (pending_cVoters[data.data[0]]) {
                    socket.emit('submitConfirmation', {status: false})
                    status = false;
                }
                else {
                    pending_cVoters[data.data[0]] = "Pending";
                }
            }
            else if (data.data[2].category.includes("SHS")) {
                if (pending_shsVoters[data.data[0]]) {
                    socket.emit('submitConfirmation', {status: false})
                    status = false;
                }
                else {
                    pending_shsVoters[data.data[0]] = "Pending";
                }
            }                        
        }
        if (status) {
            let encryptedLink = urlCrypt.cryptObj(data.data);
            EmailReceipt.sendEmail(socket.id, data.data, encryptedLink);
        }
    });

    // TODO: CHANGE THIS TO WHEN A VOTE IS CASTED INSTEAD
    // Update standings
    socket.on("getResults", function(){
        let data = [];
        for (let key in cacheEntries) {
            data.push({name: key, score: cacheEntries[key].votes.length});            
        }        
        socket.emit('current', data);
    });

    // On Connected User disconnection
    socket.on('disconnect', function(){
        connectedUsers--;
        delete connectedSockets[socket.id];
        io.emit('connectedUsers', {number: connectedUsers});
    })
});

server.listen((process.env.PORT), function(){
    console.log("Server Running on Port: " + (process.env.PORT));
})