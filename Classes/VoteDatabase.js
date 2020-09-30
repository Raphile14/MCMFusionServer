const Entries = require('./Entries.json');
const mmEntries = require('./StaycationEntries.json');
const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = class VoteDatabase {
    constructor(cacheCategories, cacheEntries, shsVoters, cVoters, cacheMMEntries, cacheMMCategories){
        this.cacheCategories = cacheCategories;
        this.cacheEntries = cacheEntries;
        this.shsVoters = shsVoters;
        this.cVoters = cVoters;
        this.cacheMMEntries = cacheMMEntries;
        this.cacheMMCategories = cacheMMCategories;
        this.format = [["email", "name", "voted_team", "date"]];
        this.doc;
        this.judgeSheets = ["judging_fac", "judging_ss", "judging_vv", "judging_mm"]
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
            private_key: ((process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'))),
        });
         // loads document properties and worksheets
        await this.doc.loadInfo();
        //////////////////////////////////////
        // Read Entries.json and MMEntries.json
        //////////////////////////////////////
        for (let key in Entries) {
            if (!this.cacheCategories.includes(Entries[key].category)) {
                this.cacheCategories.push(Entries[key].category);
            }
            this.cacheEntries[key] = {votes: [], data: Entries[key]};            
        }
        for (let key in mmEntries) {
            if (!this.cacheMMCategories.includes(mmEntries[key].category)) {
                this.cacheMMCategories.push(mmEntries[key].category);
            }
            this.cacheMMEntries[key] = {votes: [], data: mmEntries[key]};            
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

        // console.log(mmEntries);
        // save to mm cache storage
        // console.log(this.doc.sheetCount);
        // const sheet = this.doc.sheetsByIndex[6];
        // console.log(sheet.title)
        // for (let x in this.judgeSheets) {
        //     console.log(this.judgeSheets[x]);
        //     const sheet = this.doc.sheetsById[this.judgeSheets[x]];
        //     console.log(sheet.title)
        //     // const rows = await sheet.getRows();
        //     for (let y in rows) {
        //         // this
        //     }
        //     console.log("Sheet " + sheet.title + " loaded successfully");  
        // }        
    }
    // async submitVote(data, io) {
    //     for (let x = 2; x < data.length; x++) {
    //         if (data[x].category.includes("SHS")) {
    //             this.shsVoters.push(data[0]);                
    //         }
    //         else if (data[x].category.includes("COLLEGE")) {
    //             this.cVoters.push(data[0]);
    //         }
    //         this.cacheEntries[data[x].team].votes.push(data[0]);

    //         // Save to Excel Database
    //         // Get date
    //         let today = new Date();
    //         let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //         // Append Data to sheet
    //         const sheet = this.doc.sheetsByIndex[this.cacheCategories.indexOf(data[x].category)];
    //         await sheet.addRow({email: data[0], name: data[1], voted_team: data[x].team, date: date});    
    //         io.emit("current", {name: data[x].team, score: this.cacheEntries[data[x].team].votes.length});
    //     }
    // }

    // Submit Judge Score
    // async submitScoreFAC(data) {        
    //     const sheet = this.doc.sheetsByIndex[6];
    //     await sheet.addRows(data);
    // }
    // async submitScoreSS(data) {        
    //     const sheet = this.doc.sheetsByIndex[7];
    //     await sheet.addRows(data);
    // }
    // async submitScoreVV(data) {        
    //     const sheet = this.doc.sheetsByIndex[8];
    //     await sheet.addRows(data);
    // }
    // async submitScoreMM(data) {        
    //     const sheet = this.doc.sheetsByIndex[9];
    //     await sheet.addRows(data);
    // }
}