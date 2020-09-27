const XLSX = require('xlsx');
const fs = require('fs');
const Entries = require('./Entries.json');

module.exports = class VoteDatabase {
    constructor(cacheCategories, cacheEntries){
        this.cacheCategories = cacheCategories;
        this.cacheEntries = cacheEntries;
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
                    // console.log(this.cacheEntries[tempSheetJSONStorage[outer].data[inner].voted_team].votes.length);
                }
            }            
        }
        // console.log(this.cacheCategories);
        // console.log(this.cacheEntries);
        // console.log(tempSheetJSONStorage);
    }
}