const Entries = require('./Entries.json');
const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = class VoteDatabase {
    constructor(cacheCategories, cacheEntries, shsVoters, cVoters){
        this.cacheCategories = cacheCategories;
        this.cacheEntries = cacheEntries;
        this.shsVoters = shsVoters;
        this.cVoters = cVoters;
        this.format = [["email", "name", "voted_team", "date"]];
        this.doc;
    }
    // Initialize by Files
    async init() {
        //////////////////////////////////////
        // Access Google Drive Database
        //////////////////////////////////////
        this.doc = new GoogleSpreadsheet(process.env.GOOGLE_FILE_LINK);
        // use service account creds
        await this.doc.useServiceAccountAuth({
            client_email: (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
            private_key: (process.env.GOOGLE_PRIVATE_KEY),
        });
         // loads document properties and worksheets
        await this.doc.loadInfo();
        //////////////////////////////////////
        // Read Entries.json
        //////////////////////////////////////
        for (let key in Entries) {
            if (!this.cacheCategories.includes(Entries[key].category)) {
                this.cacheCategories.push(Entries[key].category);
            }
            this.cacheEntries[key] = {votes: [], data: Entries[key]};            
        }

        //////////////////////////////////////
        // Read Excel Database and Update Vote standing
        //////////////////////////////////////        
        for (let x in this.cacheCategories) {
            const sheet = this.doc.sheetsByIndex[this.cacheCategories.indexOf(this.cacheCategories[x])];
            const rows = await sheet.getRows();
            for (let y in rows) {
                this.cacheEntries[rows[y].voted_team].votes.push(rows[y].email);
                // Store votes to cache
                if (this.cacheCategories[x].includes("COLLEGE")) {
                    this.cVoters.push(rows[y].email);
                }
                else if (this.cacheCategories[x].includes("SHS")) {
                    this.shsVoters.push(rows[y].email);
                }                
            }    
            console.log("Sheet " + sheet.title + " loaded successfully");        
        }
    }
    async submitVote(data, io) {
        for (let x = 2; x < data.length; x++) {
            if (data[x].category.includes("SHS")) {
                this.shsVoters.push(data[0]);                
            }
            else if (data[x].category.includes("COLLEGE")) {
                this.cVoters.push(data[0]);
            }
            this.cacheEntries[data[x].team].votes.push(data[0]);

            // Save to Excel Database
            // Get date
            let today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // Append Data to sheet
            const sheet = this.doc.sheetsByIndex[this.cacheCategories.indexOf(data[x].category)];
            await sheet.addRow({email: data[0], name: data[1], voted_team: data[x].team, date: date});    
            io.emit("current", {name: data[x].team, score: this.cacheEntries[data[x].team].votes.length});
        }
    }
}