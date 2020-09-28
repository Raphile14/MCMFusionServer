const XLSX = require('xlsx');
const fs = require('fs');
const Entries = require('./Entries.json');

module.exports = class VoteDatabase {
    constructor(cacheCategories, cacheEntries, shsVoters, cVoters){
        this.cacheCategories = cacheCategories;
        this.cacheEntries = cacheEntries;
        this.shsVoters = shsVoters;
        this.cVoters = cVoters;
        this.format = [["email", "name", "voted_team", "date"]];
    }
    // Initialize by Files
    init() {
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
        // Check and Create Excel Database
        //////////////////////////////////////
        try {
            if (!fs.existsSync("./Data/MCMFusionTechnicityVotationLogs.xlsx")) {
                console.log("Database File Does not Exists");
                let workbook = XLSX.utils.book_new(); 
                workbook.Props = {Title: "MCM Fusion: Technicity Votation Logs", Subject: "Voting Logs", Author: "Raphael Dalangin"}                
                // Convert format to xlsx compatible format
                let ws = XLSX.utils.aoa_to_sheet(this.format);
                for (let sheets in this.cacheCategories) {
                    workbook.SheetNames.push(this.cacheCategories[sheets]);
                    workbook.Sheets[this.cacheCategories[sheets]] = ws;
                }              
                XLSX.writeFile(workbook, "Data/MCMFusionTechnicityVotationLogs.xlsx");
                console.log("Database File Successfully Created");                
            }
            else {
                console.log("Database File Already Exists!")
            }
        }
        catch (err) {
            console.log(err);
        }

        //////////////////////////////////////
        // Read Excel Database and Update Vote standing
        //////////////////////////////////////
        // Read Data
        let tempSheetJSONStorage = [];
        let wb = XLSX.readFile("Data/MCMFusionTechnicityVotationLogs.xlsx", {cellDates: true});
        for (let x in this.cacheCategories) {
            tempSheetJSONStorage.push({category: this.cacheCategories[x], data: XLSX.utils.sheet_to_json(wb.Sheets[this.cacheCategories[x]])})
        }
        // Update standings
        for (let outer in tempSheetJSONStorage) {
            for (let inner in tempSheetJSONStorage[outer].data) {
                if (this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team]) {
                    this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team].votes.push(tempSheetJSONStorage[outer].data[inner].email)
                    if (this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team].data.category.includes('COLLEGE')) {
                        this.cVoters.push(tempSheetJSONStorage[outer].data[inner].email);
                    }
                    else if (this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team].data.category.includes('SHS')) {
                        this.shsVoters.push(tempSheetJSONStorage[outer].data[inner].email);
                    }
                    // console.log(this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team].votes.length);
                }
            }            
        }
        // console.log(this.cVoters);
        // console.log(this.shsVoters);
        // console.log(this.cacheCategories);
        // console.log(this.cacheEntries);
        // console.log(tempSheetJSONStorage);
    }
    submitVote(data) {
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


            let wb = XLSX.readFile("Data/MCMFusionTechnicityVotationLogs.xlsx", {cellDates: true});
            let oldData = wb.Sheets[data[x].category]
            let jsonData = XLSX.utils.sheet_to_json(oldData);
            jsonData.push({email: data[0], name: data[1], voted_team: data[x].team, date: date});
            let newData = XLSX.utils.json_to_sheet(jsonData);
            wb.Sheets[data[x].category] = newData; 
            XLSX.writeFile(wb, "Data/MCMFusionTechnicityVotationLogs.xlsx");            
        }
    }
}