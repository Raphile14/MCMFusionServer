//////////////////////////////////////
// Requirements
//////////////////////////////////////
const express = require('express');
const path = require('path');
const VDatabase = require('./Classes/VoteDatabase.js');

//////////////////////////////////////
// CACHES
//////////////////////////////////////
let cacheCategories = [];
let cacheEntries = [];

//////////////////////////////////////
// Initialization
//////////////////////////////////////
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let VoteDatabase = new VDatabase(cacheCategories, cacheEntries);

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

// Make Database file downloadable
app.get('/download', function(req, res){
    const file = `${__dirname}/Data/MCMFusionTechnicityVotationLogs.xlsx`;
    res.download(file);
});

//////////////////////////////////////
// SOCKET.IO
//////////////////////////////////////
// Variables
let connectedUsers = 0; // counts how many users are connected to the website
// Socket connection
io.on('connection', function(socket){
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
    socket.on('getEntries', function(){
        let data = [];
        for (let key in cacheEntries) {
            data.push({name: key, code: cacheEntries[key].data.code, category: cacheEntries[key].data.category, link: cacheEntries[key].data.link});
        }  
        socket.emit('receiveEntries', {categories: cacheCategories, data: data});
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
        io.emit('connectedUsers', {number: connectedUsers});
    })
});

server.listen((process.env.PORT || 5000), function(){
    console.log("Server Running on Port: " + (process.env.PORT || 5000));
})